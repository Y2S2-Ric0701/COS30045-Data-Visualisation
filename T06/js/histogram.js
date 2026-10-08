const drawHistogram = (data) => {
    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .style("height", "auto");

    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Step 6.2 Generate bins from energy-consumption values.
    xScale
        .domain(d3.extent(data, d => d.energyConsumption))
        .range([0, innerWidth])
        .nice();

    binGenerator.domain(xScale.domain());
    const bins = binGenerator(data); // Save the bins into an array

    console.log(bins); // Log the bins to the console for debugging

    // Step 6.3 Get the lower and upper bounds of bins
    const maxFrequency = d3.max(bins, bin => bin.length) || 1;

    // Define scales (from shared constants)
    yScale
        .domain([0, maxFrequency])
        .range([innerHeight, 0])
        .nice();

    // Step 6.4 Draw the bars of the histogram
    innerChart.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", bin => xScale(bin.x0) + 1)
        .attr("y", bin => yScale(bin.length))
        .attr("width", bin => Math.max(0, xScale(bin.x1) - xScale(bin.x0) - 1))
        .attr("height", bin => innerHeight - yScale(bin.length))
        .attr("fill", barColor);

    // Step 6.5 Add axes

    // Add the x-axis to the bottom of the inner chart
    innerChart.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

    // Add the x-axis label
    innerChart.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + margin.bottom - 8)
        .attr("text-anchor", "middle")
        .text("Energy Consumption");

    // Step 6.6 Add left axis

    // Add the y-axis to the bottom of the chart relative to the inner chart
    innerChart.append("g")
        .call(d3.axisLeft(yScale));

    innerChart.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 18)
        .attr("text-anchor", "middle")
        .text("Number of TVs");
};