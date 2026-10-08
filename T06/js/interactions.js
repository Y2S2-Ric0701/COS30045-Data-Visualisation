// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    const filters = [
        { id: "all", label: "All" },
        { id: "led", label: "LED" },
        { id: "oled", label: "OLED" },
        { id: "lcd", label: "LCD" }
    ];

    const filterContainer = d3.select("#filters_screen");
    filterContainer.selectAll("button")
        .data(filters)
        .join("button")
        .attr("type", "button")
        .attr("class", filter => `filter${filter.id === "all" ? " active" : ""}`)
        .text(filter => filter.label)
        .on("click", (event, filter) => {
            filterContainer.selectAll("button").classed("active", false);
            d3.select(event.currentTarget).classed("active", true);
            updateHistogram(filter.id, data);
        });
};

const updateHistogram = (filterId, data) => {
    // Step 7.4 Update the histogram
    const filteredData = filterId === "all"
        ? data
        : data.filter(d => d.screenTech.trim().toLowerCase() === filterId);

    const chart = d3.select("#histogram");
    chart.selectAll("*").remove();

    if (filteredData.length === 0) {
        chart.append("p")
            .text(`No TVs found for ${filterId.toUpperCase()}.`);
        return;
    }

    drawHistogram(filteredData);
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart
    const tooltip = innerChartS.append("g")
        .attr("class", "tooltip")
        .attr("transform", "translate(0, 500)")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Step 3.3 Append tooltip background rectangle
    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 4)
        .attr("fill", "#3f2f28")
        .attr("opacity", 0.95);

    // Step 3.4 Apped tooltip text
    tooltip.append("text")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff");
};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text")
                .text(`${d.screenSize} inches`);

            // Get the hovered circle's position
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            // Centre the tooltip above the circle
            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth},
                               ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};