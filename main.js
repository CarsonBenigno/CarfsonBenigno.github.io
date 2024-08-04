var dataset;
var copiesSoldGlobal, copiesSoldNA, copiesSoldJP, copiesSoldEU, copiesSoldOther;
var main_chart, genres, barWidth;

async function init() {
  dataset = await d3.csv('vgsales.csv');

  function calculateSalesByRegion(data, salesType) {
    return d3.nest()
      .key(function(d) { return d.Genre; })
      .rollup(function(d) {
        return d3.sum(d, function(g) { return g[salesType]; });
      })
      .entries(dataset);
  }
  
  copiesSoldGlobal = calculateSalesByRegion(dataset, 'Global_Sales');
  copiesSoldNA = calculateSalesByRegion(dataset, 'NA_Sales');
  copiesSoldEU = calculateSalesByRegion(dataset, 'EU_Sales');
  copiesSoldJP = calculateSalesByRegion(dataset, 'JP_Sales');
  copiesSoldOther = calculateSalesByRegion(dataset, 'Other_Sales');

  copiesSoldGlobal.sort(function(a, b){ return d3.descending(a.value, b.value) });
  copiesSoldNA.sort(function(a, b){ return d3.descending(a.value, b.value) });
  copiesSoldEU.sort(function(a, b){ return d3.descending(a.value, b.value) });
  copiesSoldJP.sort(function(a, b){ return d3.descending(a.value, b.value) });
  copiesSoldOther.sort(function(a, b){ return d3.descending(a.value, b.value) });

  genres = d3.map(copiesSoldGlobal, function(d){return(d.key)}).keys();
  main_chart = d3.select("#main_chart");

  draw_chart(main_chart, copiesSoldGlobal);
  display_annotation_overview();

  d3.select('body').append('div')
    .attr('id', 'tooltip');
}

function draw_chart(svg, data) {
  svg.html("");

  const margin = 50;
  const width = parseInt(svg.style("width"));
  const height = parseInt(svg.style("height"));
  const chartWidth = width - 2 * margin;
  const chartHeight = height - 2 * margin;
  barWidth = chartWidth / d3.keys(data).length;
  const maxValue = d3.max(data, d => d.value);

  const colors = ['#7D8597', '#33415C', '#001845', '#03045E', '#023E8A', '#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8'];
  const genreColors = d3.map();

  colors.forEach((color, index) => {
    genreColors.set(genres[index], color);
  });

  svg.append("g")
      .attr("transform", `translate(${margin},${margin})`)
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * barWidth)
      .attr("y", d => chartHeight - (d.value * chartHeight / maxValue))
      .attr("width", barWidth)
      .attr("height", d => d.value * chartHeight / maxValue)
      .attr("fill", d => genreColors.get(d.key));

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.key))
    .range([0, chartWidth]);
  const yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([chartHeight, 0]);

  svg.append("g")
    .attr("transform", `translate(${margin},${height - margin})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("transform", `translate(${margin},${margin})`)
    .call(d3.axisLeft(yScale).ticks(10));

  const tooltipOffset = 20;
  svg.selectAll('rect')
    .data(data)
    .on('mouseover', d => {
      d3.select('#tooltip')
        .transition().duration(200)
        .style('opacity', 1)
        .text(`Sales: ${d3.format('0.1f')(d.value)} million copies`);
    })
    .on('mouseout', () => {
      d3.select('#tooltip').style('opacity', 0);
    })
    .on('mousemove', () => {
      d3.select('#tooltip')
        .style('left', `${d3.event.pageX + tooltipOffset}px`)
        .style('top', `${d3.event.pageY - tooltipOffset}px`);
    });
}

function change_slide(svg, data) {
  draw_chart(svg, data);
}

function toggle_active(button) {
  const buttons = document.getElementsByTagName('button');
  Array.from(buttons).forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.toggle("active");
}
