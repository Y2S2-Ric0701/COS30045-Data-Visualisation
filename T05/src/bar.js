import { appendText, colors, createSvg, svgElement, technologyColor } from "./chart-utils.js";

export function renderBar(rows) {
  const container = document.querySelector("#bar-chart");
  const width = 820;
  const height = 315;
  const margin = { top: 24, right: 25, bottom: 48, left: 55 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const data = rows.map((row) => ({
    technology: row.Screen_Tech,
    value: Number(row["Mean(Labelled energy consumption (kWh/year))"]),
  })).filter((entry) => Number.isFinite(entry.value));
  const maxValue = Math.ceil(Math.max(...data.map((entry) => entry.value)) / 100) * 100;
  const y = (value) => margin.top + plotHeight - (value / maxValue) * plotHeight;
  const band = plotWidth / data.length;
  const svg = createSvg(container, {
    viewBox: `0 0 ${width} ${height}`,
    label: "Bar chart comparing mean labelled annual energy consumption of 55-inch LCD, LED and OLED televisions",
  });

  for (let value = 0; value <= maxValue; value += 100) {
    const tickY = y(value);
    svg.append(svgElement("line", {
      x1: margin.left,
      x2: width - margin.right,
      y1: tickY,
      y2: tickY,
      stroke: colors.grid,
      "stroke-width": 1,
    }));
    appendText(svg, margin.left - 10, tickY + 3, String(value), { "text-anchor": "end" });
  }

  data.forEach((entry, index) => {
    const barWidth = band * 0.47;
    const barX = margin.left + band * index + (band - barWidth) / 2;
    const barY = y(entry.value);
    const rect = svgElement("rect", {
      x: barX,
      y: barY,
      width: barWidth,
      height: margin.top + plotHeight - barY,
      rx: 5,
      fill: technologyColor[entry.technology] ?? colors.lime,
      "fill-opacity": 0.9,
    });
    rect.append(svgElement("title", {}, `${entry.technology}: ${entry.value.toFixed(1)} kWh/year average`));
    svg.append(rect);
    appendText(svg, barX + barWidth / 2, barY - 10, String(Math.round(entry.value)), {
      fill: colors.text,
      "font-size": 11,
      "text-anchor": "middle",
    });
    appendText(svg, barX + barWidth / 2, height - 20, entry.technology, {
      fill: "#c5cec7",
      "font-family": "DM Sans, sans-serif",
      "font-size": 11,
      "text-anchor": "middle",
    });
  });

  appendText(svg, 14, margin.top + plotHeight / 2, "kWh / YEAR", {
    transform: `rotate(-90 14 ${margin.top + plotHeight / 2})`,
    "text-anchor": "middle",
    "font-size": 8,
  });
}
