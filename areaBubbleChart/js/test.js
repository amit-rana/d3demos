var ChartWidth = 960,
    ChartHeight = 500,
    padding = 30,
    circleRadius = 6.5;

var points, dragged, line, svg, xScale, yScaleR, xScaleR, yScale;


function initAxes() {


 //   var logScale = d3.scale.quantize(2)
 //                 .domain([0, 8000])
 //                 .range([0, ChartWidth - padding]);

    
    var xAxis = d3.svg.axis()
    .scale(xScale)
    //.tickValues([0, 1, 2, 3, 4, 5, 6, 7])
   .tickValues([0, 50, 125, 250, 500, 1000, 2000, 4000, 8000])
    .tickSize(-ChartHeight + padding)
  //  .tickSubdivide(1)
 //   .tickFormat(function (d) {
        // if (d == 8000) return "a";
    //    return d;
   // });


    var yAxis = d3.svg.axis()
        .orient("left")
    .scale(yScale)
    .tickSize(-ChartWidth + padding)
    .tickValues([-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);


    svg.append("g")
               .attr("transform", "translate(" + padding + "," + (ChartHeight - padding) + ")")
               .attr("class", "axis")
               .call(xAxis);

    svg.append("g")
                .attr("transform", "translate(" + (padding) + ", 0)")
                .attr("class", "axis")
                .call(yAxis);

}


function initChart() {

    points = d3.range(1, 5).map(function (i) {
        return [getRandom(0, 8000), getRandom(-20, 120)];
    });

    tickWidth = (ChartWidth - padding)/7
    xScale = d3.scale.linear()
                   .domain([0, 125, 250, 500, 1000, 2000, 4000, 8000])
    .range(d3.range(8).map(function(d){ return d*tickWidth; }));

    xScaleR = d3.scale.linear()
                   .range([0, 8000])
                   .domain([0, ChartWidth - padding]);

    yScale = d3.scale.linear()
                .domain([-20, 120])
              //.domain([0, d3.max(points, function (d) { return d[1]; })])
                .range([0, ChartHeight - padding]);

    yScaleR = d3.scale.linear()
                   .range([-20, 120])
                   .domain([0, ChartHeight - padding]);


    dragged = null;

    line = d3.svg.line();

    svg = d3.select("body").append("svg")
       .attr("width", ChartWidth)
       .attr("height", ChartHeight)
       .attr("tabindex", 1);


    svg.append("rect")
        .attr("width", ChartWidth)
        .attr("height", ChartHeight)
        .on("mousedown", mousedown);

    svg.append("path")
        .datum(points)
        .attr("class", "line")
        .call(redraw);

    d3.select(window)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    d3.select("#interpolate")
        .on("change", change)
      .selectAll("option")
        .data([
          "linear",
          "step-before",
          "step-after",
          "basis",
          "basis-open",
          "basis-closed",
          "cardinal",
          "cardinal-open",
          "cardinal-closed",
          "monotone"
        ])
      .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });

}
//  svg.node().focus();

function redraw() {

    svg.select("path").attr("d", function (d) {

        var lines = new Array();

        for (var i = 0; i < d.length; i++) {
            lines.push([xScale(d[i][0]), yScale(d[i][1])]);

        }

        return line(lines);
    });



    var circle = svg.selectAll("circle")
        .data(points);

    circle.enter().append("circle")
        .attr("r", 1e-6)
        .on("mousedown", function (d) { dragged = d; redraw(); })
      .transition()
        .duration(750)
        .ease("elastic")
        .attr("r", circleRadius);


    circle
        .attr("cx", function (d) { return xScale(d[0]); })
        .attr("cy", function (d) { return yScale(d[1]); });

    circle.exit().remove();

    if (d3.event) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
    }


}

function change() {
    line.interpolate(this.value);
    redraw();
}

function mousedown() {

    var point = d3.mouse(svg.node());

    points.push(dragged = [xScaleR(point[0]), yScaleR(point[1])]);
    redraw();
}

function mousemove() {
    if (!dragged) return;
    var m = d3.mouse(svg.node());
    dragged[0] = xScaleR(Math.max(0 + padding + circleRadius, Math.min(ChartWidth - circleRadius, m[0])));
    dragged[1] = yScaleR(Math.max(0 + circleRadius, Math.min(ChartHeight - padding - circleRadius, m[1])));
    redraw();
}

function mouseup() {
    if (!dragged) return;
    mousemove();
    dragged = null;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

initChart();
initAxes();