const createBarChart = (data) => {
  // --- Sizes (logical vs. display) ---
  const viewW = 500;
  const viewH = Math.max(220, data.length * 28);
  const displayW = 640;
  const displayH = Math.min(480, data.length * 24 + 40);

  // --- SVG root ---
  const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", `0 0 ${viewW} ${viewH}`)
    .attr("width", displayW)
    .attr("height", displayH)
    .attr("role", "img")
    .attr("aria-label", "Bar chart of registered television models by brand");

  // Theme colours from style/index.css
  const ink = "#29241e";
  const muted = "#756b5d";
  const orange = "#f79b26";

  // Labels end and bars start at labelX (140 rather than 100 so long
  // brand names like "SAMSUNG ELECTRONICS" are not clipped on the left)
  const labelX = 140;
  // Leave room on the right for the value label of the longest bar
  const valueGap = 40;

  // --- Scales (from T04-6) ---
  const xMax = d3.max(data, d => d.count);
  const xScale = d3.scaleLinear()
    .domain([0, xMax])
    .range([0, viewW - labelX - valueGap]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, viewH])
    .paddingInner(0.2)
    .paddingOuter(0.1);

  // OLD rectangle-only drawing block from T04-6 (COMMENTED OUT for T04-7)
  /*
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", 0)
    .attr("y", d => yScale(d.brand))
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");
  */

  // --- T04-7: one group per row so the bar and its labels move together ---
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("class", "bar-row")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // --- Bar rectangle inside the group ---
  // y is 0 because the group sets the vertical position via transform
  barAndLabel
    .append("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", labelX)
    .attr("y", 0)
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", orange);

  // --- Category text (left of bar, right-aligned at labelX) ---
  barAndLabel
    .append("text")
    .text(d => d.brand)
    .attr("x", labelX - 8)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "end")
    .attr("fill", muted)
    .style("font-family", "Arial, Helvetica, sans-serif")
    .style("font-size", "11px")
    .style("font-weight", "700")
    .style("letter-spacing", "0.04em");

  // --- Value text (just past the end of each bar) ---
  barAndLabel
    .append("text")
    .text(d => d.count)
    .attr("x", d => labelX + xScale(d.count) + 6)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dominant-baseline", "middle")
    .attr("fill", ink)
    .style("font-family", "Arial, Helvetica, sans-serif")
    .style("font-size", "12px")
    .style("font-weight", "800");
};
