// T04-4: Load the brand summary CSV, convert count to a number, then draw the chart
d3.csv("data/tv_brand_counts.csv", d => ({
  brand: d.brand,
  count: +d.count
})).then(data => {
  console.log(data);
  createBarChart(data);
}).catch(error => {
  console.error("Error loading the CSV file:", error);
});
