import { appendText, colors, createSvg, svgElement } from "./chart-utils.js";

const averageColumn = "Average Price (notTas-Snowy)";

export function renderLine(rows) {
  const container = document.querySelector("#line-chart");
  const width = 820;
  const height = 315;
  const margin = { top: 23, right: 24, bottom: 45, left: 59 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const data = rows.map((row) => ({
    year: Number(row.Year),
    price: Number(row[averageColumn]),
  })).filter((entry) => Number.isFinite(entry.year) && Number.isFinite(entry.price));
  const minYear = Math.min(...data.map((entry) => entry.year));
  const maxYear = Math.max(...data.map((entry) => entry.year));
  const maxPrice = Math.ceil(Math.max(...data.map((entry) => entry.price)) / 50) * 50;
  const x = (year) => margin.left + ((year - minYear) / (maxYear - minYear)) * plotWidth;
  const y = (price) => margin.top + plotHeight - (price / maxPrice) * plotHeight;
  const svg = createSvg(container, {
    viewBox: `0 0 ${width} ${height}`,
    label: `Line chart of average Australian electricity spot prices from ${minYear} to ${maxYear}, in dollars per megawatt hour`,
  });
  const defs = svgElement("defs");
  const gradient = svgElement("linearGradient", { id: "price-fill", x1: "0", x2: "0", y1: "0", y2: "1" });
  gradient.append(svgElement("stop", { offset: "0%", "stop-color": colors.mint, "stop-opacity": 0.24 }));
  gradient.append(svgElement("stop", { offset: "100%", "stop-color": colors.mint, "stop-opacity": 0 }));
  defs.append(gradient);
  svg.append(defs);

  for (let value = 0; value <= maxPrice; value += 50) {
    const tickY = y(value);
    svg.append(svgElement("line", {
      x1: margin.left,
      x2: width - margin.right,
      y1: tickY,
      y2: tickY,
      stroke: colors.grid,
      "stroke-width": 1,
    }));
    appendText(svg, margin.left - 11, tickY + 3, `$${value}`, { "text-anchor": "end" });
  }

  const linePoints = data.map((entry) => `${x(entry.year)},${y(entry.price)}`).join(" ");
  const areaPath = [
    `M ${x(data[0].year)} ${margin.top + plotHeight}`,
    ...data.map((entry) => `L ${x(entry.year)} ${y(entry.price)}`),
    `L ${x(data[data.length - 1].year)} ${margin.top + plotHeight}`,
    "Z",
  ].join(" ");
  svg.append(svgElement("path", { d: areaPath, fill: "url(#price-fill)" }));
  svg.append(svgElement("polyline", {
    points: linePoints,
    fill: "none",
    stroke: colors.mint,
    "stroke-width": 2.5,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  }));

  for (const entry of data) {
    const circle = svgElement("circle", {
      cx: x(entry.year),
      cy: y(entry.price),
      r: entry.year === maxYear ? 4.3 : 2.3,
      fill: entry.year === maxYear ? colors.lime : colors.mint,
      stroke: "#171b19",
      "stroke-width": 1.4,
    });
    circle.append(svgElement("title", {}, `${entry.year}: $${entry.price.toFixed(2)} per MWh`));
    svg.append(circle);
  }

  for (const year of data.filter((entry) => (entry.year - minYear) % 4 === 0 || entry.year === maxYear)) {
    appendText(svg, x(year.year), height - 17, String(year.year), {
      "text-anchor": "middle",
    });
  }

  appendText(svg, margin.left + plotWidth / 2, 12, "AVERAGE SPOT PRICE ($ / MWh)", {
    fill: "#a7b1aa",
    "font-size": 8,
    "text-anchor": "middle",
  });
}
