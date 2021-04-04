// @TODO: YOUR CODE HERE!
var svgWidth = 855;
var svgHeight = 655;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
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

var chosenXAxis = "poverty";

function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.9, d3.max(stateData, d => d[chosenXAxis]) * 1.1])
        .range([0, width]);
    return xLinearScale;
}

function renderX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

var chosenYAxis = "healthcare";

function yScale(stateData, chosenXAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.9, d3.max(stateData, d => d[chosenYAxis]) * 1.1])
        .range([height, 0]);
    return yLinearScale;
}

function renderY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

function renderAbbr(abbrGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    abbrGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis])+5)
    return abbrGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup) {
    var xlabel;
    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty (%):";
    } else if (chosenXAxis === "age") {
        xlabel = "Age (Median):";
    } else if (chosenXAxis === "income") {
        xlabel = "Household Income (Median):";
    }; 

    var ylabel;
    if (chosenYAxis === "healthcare") {
        ylabel = "Lacks Healthcare (%):";
    } else if (chosenYAxis === "smokes") {
        ylabel = "Smokes (%):";
    } else if (chosenYAxis === "obesity") {
        ylabel = "Obese (%):";
    };
  
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(d) {
            return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
        });
    
    circlesGroup.call(toolTip);
    
    abbrGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });
  
    abbrGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });
    return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(stateData) {
    
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });
  
    var xLinearScale = xScale(stateData, chosenXAxis);

    var yLinearScale = yScale(stateData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(14);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter().append("circle")
        .classed("stateCircle",true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("value", "circle")
        .attr("r", "15")
        .attr("opacity", 0.75)

    var abbrGroup = chartGroup.append("g")
        .selectAll("text")
        .data(stateData)
        .enter().append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+5)
        .attr("value", "abbr")
        .classed("stateText", true)
        .text(data => data.abbr);

    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em");
    
    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active aText", true)
        .text("In Poverty (%)");
    
    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") 
        .classed("inactive aText", true)
        .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive aText", true)
        .text("Income (Median)");

    var healthLabel = ylabelsGroup.append("text")
        .attr("y", 60 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare")
        .classed("active aText", true)
        .text("Lacks Healthcare (%)");

    var smokeLabel = ylabelsGroup.append("text")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .classed("inactive aText", true)
        .text("Smokes (%)");

    var obeseLabel = ylabelsGroup.append("text")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
        .classed("inactive aText", true)
        .text("Obese (%)");

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup);

    xlabelsGroup.selectAll("text")
    .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
            chosenXAxis = value;

            xLinearScale = xScale(stateData, chosenXAxis);

            xAxis = renderX(xLinearScale, xAxis);

            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup);

            abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            if (chosenXAxis === "poverty") {
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenXAxis === "age") {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenXAxis === "income") {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }
    });

    ylabelsGroup.selectAll("text")
    .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            chosenYAxis = value;

            yLinearScale = yScale(stateData, chosenYAxis);

            yAxis = renderY(yLinearScale, yAxis);

            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup);

            abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            if (chosenYAxis === "healthcare") {
                healthLabel
                .classed("active", true)
                .classed("inactive", false);
                smokeLabel
                .classed("active", false)
                .classed("inactive", true);
                obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenYAxis === "smokes") {
                healthLabel
                .classed("active", false)
                .classed("inactive", true);
                smokeLabel
                .classed("active", true)
                .classed("inactive", false);
                obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenYAxis === "obesity") {
                healthLabel
                .classed("active", false)
                .classed("inactive", true);
                smokeLabel
                .classed("active", false)
                .classed("inactive", true);
                obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            }
        }
    });
}).catch(function(error) {
    console.log(error)
});