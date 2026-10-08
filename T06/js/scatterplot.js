const drawScatterplot = (data) => {
    // T06-2 Step 2.2
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width + 150} ${height}`)
        .attr("width", "100%")
        .style("height", "auto");

    innerChartS = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // T06-2 Step 2.3
    xScaleS
        .domain(d3.extent(data, d => d.screenSize))
        .range([0, innerWidth])
        .nice();
    yScaleS
        .domain(d3.extent(data, d => d.star))
        .range([innerHeight, 0])
        .nice();

    /// Map star ratings and screen sizes to positions within the chart area.

    // T06-2 Step 2.4
    /// (Corrected code) Set up colours for screen technologies
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);
    
    // T06-2 Step 2.5 Draw the circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.screenSize))
        .attr("cy", d => yScaleS(d.star))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech));

    // T06-2 Step 2.6 Add bottom and left axis
    /// Add axes
    innerChartS.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScaleS));
    innerChartS.append("g")
        .call(d3.axisLeft(yScaleS));

    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + margin.bottom - 8)
        .attr("text-anchor", "middle")
        .text("Screen Size (inches)");
    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 18)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    // T06-2 Step 2.7 Add legend
    /// Add a legend on the right-hand side
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("aria-label", "Screen technology legend")
        .attr("transform", `translate(${width - margin.right + 20},${margin.top})`);

    // Show each screen technology with its matching point colour.
    const legendItems = legend.selectAll("g")
        .data(uniqueTechs)
        .join("g")
        .attr("transform", (technology, index) => `translate(0,${index * 24})`);

    legendItems.append("circle")
        .attr("cx", 5)
        .attr("cy", 5)
        .attr("r", 5)
        .attr("fill", technology => colorScale(technology));

    legendItems.append("text")
        .attr("x", 16)
        .attr("y", 9)
        .attr("font-size", 14)
        .attr("fill", "#3f2f28")
        .text(technology => technology);

};