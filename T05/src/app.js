import { parseCsv } from "./chart-utils.js";
import { renderBar } from "./bar.js";
import { renderDonut } from "./donut.js";
import { renderLine } from "./line.js";
import { renderScatter } from "./scatter.js";

const datasetFiles = {
  televisions: "../Ex5/Ex5_TV_energy.csv",
  allScreenMeans: "../Ex5/Ex5_TV_energy_Allsizes_byScreenType.csv",
  fiftyFiveMeans: "../Ex5/Ex5_TV_energy_55inchtv_byScreenType.csv",
  spotPrices: "../Ex5/Ex5_ARE_Spot_Prices.csv",
};

async function loadDataset(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path} (${response.status} ${response.statusText}).`);
  }
  return parseCsv(await response.text());
}

async function renderDashboard() {
  const status = document.querySelector("#data-status");
  try {
    const [televisions, allScreenMeans, fiftyFiveMeans, spotPrices] = await Promise.all(
      Object.values(datasetFiles).map(loadDataset),
    );
    renderScatter(televisions);
    renderDonut(televisions);
    renderBar(fiftyFiveMeans);
    renderLine(spotPrices);
    document.querySelector("#profile-count").textContent = televisions.length.toLocaleString();
    const years = spotPrices.map((row) => Number(row.Year)).filter(Number.isFinite);
    document.querySelector("#year-range").textContent = `${Math.min(...years)}–${Math.max(...years)}`;
    status.textContent = `Loaded ${televisions.length.toLocaleString()} TV profiles, ${allScreenMeans.length} screen technology summaries and ${spotPrices.length} years of spot prices.`;
  } catch (error) {
    status.classList.add("error");
    status.textContent = error instanceof Error
      ? `Unable to display the charts: ${error.message}`
      : "Unable to display the charts because an unexpected error occurred.";
    console.error(error);
  }
}

renderDashboard();
