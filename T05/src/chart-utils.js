export const colors = {
  text: "#eff3ef",
  muted: "#849087",
  grid: "#2c3430",
  lime: "#cdf568",
  mint: "#6fe0ba",
  violet: "#b9a4ff",
  orange: "#ffa96e",
};

export const technologyColor = {
  LCD: colors.lime,
  LED: colors.mint,
  OLED: colors.violet,
};

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((value) => value !== "")) rows.push(row);
  }

  const [headers, ...records] = rows;
  if (!headers) throw new Error("The dataset is empty.");
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])),
  );
}

export function svgElement(name, attributes = {}, text) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  if (text !== undefined) element.textContent = text;
  return element;
}

export function createSvg(container, { viewBox, label }) {
  container.replaceChildren();
  const svg = svgElement("svg", {
    viewBox,
    role: "img",
    "aria-label": label,
    focusable: "false",
  });
  container.append(svg);
  return svg;
}

export function appendText(svg, x, y, text, attributes = {}) {
  const element = svgElement("text", {
    x,
    y,
    fill: colors.muted,
    "font-family": "DM Mono, monospace",
    "font-size": 10,
    ...attributes,
  }, text);
  svg.append(element);
  return element;
}

export function numericValues(rows, field) {
  return rows
    .map((row) => Number(row[field]))
    .filter((value) => Number.isFinite(value));
}
