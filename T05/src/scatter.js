import { appendText, colors, createSvg, svgElement, technologyColor } from "./chart-utils.js";

const techFor = (value) => value === "LCD (LED)" ? "LED" : value;

export function renderScatter(rows) {
  const container = document.querySelector("#scatter-chart");
  const width = 820;
  const height = 350;
  const margin = { top: 18, right: 18, bottom: 52, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const data = rows.map((row) => ({
    energy: Number(row.energy_consumpt),
    rating: Number(row.star2),
    count: Number(row.count),
    technology: techFor(row.screen_tech),
  })).filter((point) => Number.isFinite(point.energy) && Number.isFinite(point.rating));

  const minEnergy = Math.floor(Math.min(...data.map((point) => point.energy)) / 100) * 100;
  const maxEnergy = Math.ceil(Math.max(...data.map((point) => point.energy)) / 100) * 100;
  const minRating = Math.floor(Math.min(...data.map((point) => point.rating)));
  const maxRating = Math.ceil(Math.max(...data.map((point) => point.rating)));
  const x = (value) => margin.left + ((value - minEnergy) / (maxEnergy - minEnergy)) * plotWidth;
  const y = (value) => margin.top + plotHeight - ((value - minRating) / (maxRating - minRating)) * plotHeight;
  const svg = createSvg(container, {
    viewBox: `0 0 ${width} ${height}`,
    label: "Scatter plot of annual television energy consumption in kilowatt-hours against star rating",
  });

  for (let value = minRating; value <= maxRating; value += 1) {
    const tickY = y(value);
    svg.append(svgElement("line", {
      x1: margin.left,
      x2: width - margin.right,
      y1: tickY,
      y2: tickY,
      stroke: colors.grid,
      "stroke-width": 1,
    }));
    appendText(svg, margin.left - 12, tickY + 3, String(value), { "text-anchor": "end" });
  }

  for (let value = minEnergy; value <= maxEnergy; value += 200) {
    const tickX = x(value);
    svg.append(svgElement("line", {
      x1: tickX,
      x2: tickX,
      y1: margin.top,
      y2: margin.top + plotHeight,
      stroke: colors.grid,
      "stroke-width": 1,
    }));
    appendText(svg, tickX, height - 27, String(value), { "text-anchor": "middle" });
  }

  svg.append(svgElement("line", {
    x1: margin.left,
    x2: margin.left,
    y1: margin.top,
    y2: margin.top + plotHeight,
    stroke: "#69746c",
  }));
  svg.append(svgElement("line", {
    x1: margin.left,
    x2: width - margin.right,
    y1: margin.top + plotHeight,
    y2: margin.top + plotHeight,
    stroke: "#69746c",
  }));
  appendText(svg, 15, margin.top + plotHeight / 2, "STAR RATING", {
    transform: `rotate(-90 15 ${margin.top + plotHeight / 2})`,
    "text-anchor": "middle",
    "font-size": 8,
  });
  appendText(svg, margin.left + plotWidth / 2, height - 4, "ENERGY CONSUMPTION (kWh/year)", {
    "text-anchor": "middle",
    "font-size": 8,
    fill: "#a7b1aa",
  });

  for (const point of data) {
    const color = technologyColor[point.technology] ?? colors.text;
    const circle = svgElement("circle", {
      cx: x(point.energy),
      cy: y(point.rating),
      r: 2.4 + Math.sqrt(Math.max(0, point.count)) * 1.15,
      fill: color,
      "fill-opacity": 0.62,
      stroke: "#121614",
      "stroke-width": 0.7,
    });
    circle.append(svgElement("title", {}, `${point.technology} · ${point.energy} kWh/year · ${point.rating} stars · profile count ${point.count}`));
    svg.append(circle);
  }
}
