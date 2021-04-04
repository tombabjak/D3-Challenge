// @TODO: YOUR CODE HERE!
var svgWidth = 855;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .classed("chart",true);

d3.csv("assets/data/data.csv").then(function(stateData) {

    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      console.log(data.abbr)
    });
  
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(stateData, d => d.poverty))
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(stateData, d => d.healthcare))
    .range([height, 0]);
 
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(14);
   
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter().append("circle")
    .classed("stateCircle",true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("value", "circle")
    .attr("r", "15")
    .attr("opacity", 0.75)
    

    var labelsGroup = chartGroup.append("g")
    .selectAll("text")
    .data(stateData)
    .enter().append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare)+5)
    .attr("value", "abbr")
    .classed("stateText", true)
    .text(data => data.abbr);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("In Poverty (%)");

}).catch(function(error) {
    console.log(error);
});
    
