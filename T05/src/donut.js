import { appendText, colors, createSvg, svgElement, technologyColor } from "./chart-utils.js";

const techFor = (value) => value === "LCD (LED)" ? "LED" : value;
const formatCompact = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return Math.round(value).toLocaleString();
};

function arcPath(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
  const point = (radius, angle) => [
    cx + radius * Math.cos(angle),
    cy + radius * Math.sin(angle),
  ];
  const [outerStartX, outerStartY] = point(outerRadius, startAngle);
  const [outerEndX, outerEndY] = point(outerRadius, endAngle);
  const [innerEndX, innerEndY] = point(innerRadius, endAngle);
  const [innerStartX, innerStartY] = point(innerRadius, startAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}`,
    "Z",
  ].join(" ");
}

export function renderDonut(rows) {
  const container = document.querySelector("#donut-chart");
  const totals = new Map();
  for (const row of rows) {
    const technology = techFor(row.screen_tech);
    const energy = Number(row.energy_consumpt);
    const count = Number(row.count);
    if (Number.isFinite(energy) && Number.isFinite(count)) {
      totals.set(technology, (totals.get(technology) ?? 0) + energy * count);
    }
  }

  const data = [...totals].map(([technology, value]) => ({ technology, value }));
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const width = 560;
  const height = 310;
  const centerX = 165;
  const centerY = 154;
  const outerRadius = 105;
  const innerRadius = 69;
  const svg = createSvg(container, {
    viewBox: `0 0 ${width} ${height}`,
    label: "Donut chart showing the share of estimated combined annual television energy use by screen technology",
  });

  let angle = -Math.PI / 2;
  for (const entry of data) {
    const endAngle = angle + (entry.value / total) * Math.PI * 2;
    const path = svgElement("path", {
      d: arcPath(centerX, centerY, outerRadius, innerRadius, angle, endAngle),
      fill: technologyColor[entry.technology] ?? colors.text,
      stroke: "#171b19",
      "stroke-width": 3,
    });
    path.append(svgElement("title", {}, `${entry.technology}: ${Math.round(entry.value).toLocaleString()} kWh/year (${((entry.value / total) * 100).toFixed(1)}%)`));
    svg.append(path);
    angle = endAngle;
  }

  appendText(svg, centerX, centerY - 3, formatCompact(total), {
    fill: colors.text,
    "font-family": "Space Grotesk, sans-serif",
    "font-size": 22,
    "font-weight": 600,
    "text-anchor": "middle",
  });
  appendText(svg, centerX, centerY + 16, "kWh / YEAR", {
    "font-size": 8,
    "text-anchor": "middle",
  });

  data.forEach((entry, index) => {
    const y = 102 + index * 44;
    const share = (entry.value / total) * 100;
    svg.append(svgElement("circle", {
      cx: 320,
      cy: y - 4,
      r: 4,
      fill: technologyColor[entry.technology] ?? colors.text,
    }));
    appendText(svg, 334, y, entry.technology, {
      fill: "#e3e9e3",
      "font-family": "DM Sans, sans-serif",
      "font-size": 12,
      "font-weight": 600,
    });
    appendText(svg, 535, y, `${share.toFixed(1)}%`, {
      fill: "#b8c2ba",
      "font-size": 9,
      "text-anchor": "end",
    });
    appendText(svg, 334, y + 17, `${Math.round(entry.value).toLocaleString()} kWh / yr`, {
      "font-size": 8,
    });
  });
}
