


d3.gantt = function() {

    // define style
    var defsEnter;

    // for drag&drop
    var dragRectang;
    var draging = false;
    var format = d3.time.format("%Y-%m-%d %H:%M");

    //text Util
    var TextUtils = null;

    // for resize activity
    var curSelection = null;
    var resizeStatus = false;
    var isResizing = false;

    // for time line
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.day.offset(new Date(),+3);

    // data source
    rawData = {};

    var keyFunction = function(d) {
        var ret = d.startDate + d.taskName + d.endDate;
        return ret;
    };

    var rectTransform = function(d) {
        var ret = "translate(" + rawData.scale.x(d.startDate) + "," + rawData.scale.y(d.taskName) + ")";
        return ret;
    };

    var initAxis = function() {
        rawData.scale.x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, rawData.layout.width ]).clamp(false);
        rawData.scale.y = d3.scale.ordinal().domain(rawData.taskNames).rangeBands([ rawData.layout.head, rawData.layout.height - rawData.layout.margin.top - rawData.layout.margin.bottom ]);
        rawData.scale.xaxis = d3.svg.axis().scale(rawData.scale.x).orient("bottom");//ticks(rawData.time.interval, rawData.time.tick).tickFormat(d3.time.format(rawData.layout.tickFormat)).tickSubdivide(false);
        rawData.scale.yaxis = d3.svg.axis().scale(rawData.scale.y).orient("left").ticks(5);
        rawData.scale.xaxis_handle = d3.svg.axis().scale(rawData.scale.x).orient("bottom");//ticks(rawData.time.interval, rawData.time.tick).tickFormat(d3.time.format(rawData.layout.tickFormat)).tickSubdivide(false);
    };

    function gantt() {

        initAxis();

        var svg = d3.select("#chart")
        .append("svg")
        .on("mousemove", function(d, i) {
        })
        .on("mouseout", function(d, i) { })
        .attr("class", "chart")
        .attr("width", rawData.layout.width + rawData.layout.margin.left + rawData.layout.margin.right)
        .attr("height", rawData.layout.height + rawData.layout.margin.top + rawData.layout.margin.bottom)
        .append("g")
        .attr("class", "gantt-chart")


        // draw background
        var bg = svg.selectAll(".bk_shape")
        .data(rawData.taskStatus).enter();

  

        rawData.layout.backcolorcount = 0;

        // draw activity
        var sc = svg.selectAll(".m_dataShape")
        .data(rawData.tasks, keyFunction).enter();

        var drag = d3.behavior.drag();


        var rectg = sc.append("g").attr('class',"m_dataShape").attr("transform", rectTransform)
        .call(drag);

        return gantt;
    };

  

    gantt.resourceListInit = function() {
        rawData.scale.x_tree = d3.scale.ordinal()
        .domain(rawData.layout.treetitle)
        .range([ 0, rawData.layout.treeactualwidth/12, rawData.layout.treeactualwidth*2/5,
        rawData.layout.treeactualwidth*2/3, rawData.layout.treeactualwidth ]);
    };

    gantt.resourceListTitle = function() {
       
    };

    var keyFunction_tree = function(d, i) {
        var ret = d.type+":"+d.parent+"."+d.source;
        //console.log(i + ":" + ret);
        return ret;
    };

    gantt.resourceList = function() {
        // draw background for tree
        var bg_tree = oRawData.svg.svg_tree.selectAll(".bk_shape_tree")
        .data(rawData.taskStatus, keyFunction_tree);
        // for update
        rawData.layout.backcolorcount = 0;
        bg_tree
        .attr("transform", function(d) {
            return "translate(" + 0 + "," + rawData.scale.y(d.type+":"+d.parent+"."+d.source) + ")";
        })
        .select("rect")
        .style("fill", function(d, i){
            if(d.type == "other.empty" || d.type == "other.utilization") {
                return "#DDDDDD";
            }
            else if(rawData.layout.backcolorcount % 2 == 1) {
                rawData.layout.backcolorcount++;
                return "#FFFFFF";
            }
            else {
                rawData.layout.backcolorcount++;
                return "#EDF3EE";
            }
        })
        .attr("width", rawData.layout.treewidth)
        .attr("height", function(d) { return rawData.scale.y.rangeBand(); });
        // for remove
        bg_tree.exit().remove();
        // for enter
        rawData.layout.backcolorcount = 0;
        bg_tree.enter().append("g").attr("class", "bk_shape_tree")
        .attr("transform", function(d, i) {
            return "translate(" + 0 + "," + rawData.scale.y(d.type+":"+d.parent+"."+d.source) + ")";
        })
        .append("rect")
        .style("fill", function(d, i){
            if(d.type == "other.empty" || d.type == "other.utilization") {
                return "#DDDDDD";
            }
            else if(rawData.layout.backcolorcount % 2 == 1) {
                rawData.layout.backcolorcount++;
                return "#FFFFFF";
            }
            else {
                rawData.layout.backcolorcount++;
                return "#EDF3EE";
            }
        })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", rawData.layout.treewidth)
        .attr("height", function(d) { return rawData.scale.y.rangeBand(); });

        // draw node for tree
        var sc_tree = oRawData.svg.svg_tree.selectAll(".m_dataNode")
        .data(rawData.taskStatus, keyFunction_tree);

        // for update
        sc_tree
        .attr("transform", function(d){
            return "translate(" + 0 + "," + rawData.scale.y(d.type+":"+d.parent+"."+d.source) + ")";
        });
        // for remove
        sc_tree.exit().remove();
        // for enter
        var rectg_tree = sc_tree.enter().append("g").attr('class',"m_dataNode")
        .attr("transform", function(d){
            return "translate(" + 0 + "," + rawData.scale.y(d.type+":"+d.parent+"."+d.source) + ")";
        });
        rectg_tree.append("path")
        .style("fill", "black")
        .style("stroke", "black")
        .attr("d", d3.svg.symbol().type("triangle-down").size(60))
        .attr("transform", function(d) {
            if(d.type == "other.empty" || d.type == "other.utilization") {
                return "translate(" + -1000 + "," + -1000 + ")";
            }
            var x = rawData.layout.offsetYforTriangle;
            var y = rawData.layout.offsetYforTriangle;
            return "translate(" + x + "," + y + ") rotate(30)";
        })
        .on("click", function(d) {
            var pos = rawData.taskNames.indexOf(d.type+":"+d.parent+"."+d.source);
            rawData.taskStatus[pos].expand = 1 - rawData.taskStatus[pos].expand;
            if(rawData.taskStatus[pos].expand) {
                insertUtilization(pos+1);
            }
            else {
                oRawData.taskNames.splice(pos+1, oRawData.layout.utilizationbandcount);
                oRawData.taskStatus.splice(pos+1, oRawData.layout.utilizationbandcount);
            }
            d3.select(this)
            .attr("transform", function(d) {
                var x = rawData.layout.offsetYforTriangle;
                var y = rawData.layout.offsetYforTriangle;
                if(rawData.taskStatus[pos].expand) {
                    return "translate(" + x + "," + y + ")";
                }
                return "translate(" + x + "," + y + ") rotate(30)";
            });

            // invoke drawing utilization
            tTaskName = rawData.taskNames[pos];

            tyUtilization = rawData.scale.y(d.type+":"+d.parent+"."+d.source);
            theightUtilization = rawData.scale.y.rangeBand() * oRawData.layout.utilizationbandcount;
            var yUti = d.type+":"+d.parent+"."+d.source;
            rawData.utasks.push({taskName:tTaskName, y:yUti, height:theightUtilization});
            // end of invoke drawing utilization

            reDraw(false);

            //else {
            //var bcId = "bc"+rawData.taskNames[pos];
            //removeBarChart(bcId);
            //}
        });

        for(var i = 1; i < rawData.layout.treetitle.length; i++) {
            // for update
            sc_tree
            .attr("transform", function(d){
                return "translate(" + 0 + "," + rawData.scale.y(d.type+":"+d.parent+"."+d.source) + ")";

            });
            // for remove
            sc_tree.exit().remove();
            // for enter
            rectg_tree.append("text").attr('class',rawData.layout.treetitle[i])
            .attr("height", function(d) { return rawData.scale.y.rangeBand(); })
            .attr("x", function(d){
                var offset = d.level*rawData.layout.indentation;
                if(d.type == "other.utilization") {
                    offset += rawData.layout.imageindentation;
                }
                return rawData.scale.x_tree(rawData.layout.treetitle[i])+offset;
            })
            .attr("y", function(d){
                if(d.type == "other.utilization") {
                    return rawData.layout.offsetYforUtilizationText;
                }
                return rawData.layout.offsetYforText;
            })
            .attr("dy", ".71em")
            .text(function(d) {
                return rawData.resources[d.source][rawData.layout.treetitle[i]];
            });
        }
        // for enter
        rectg_tree.append("image")
        .attr("xlink:href", "images\\chart.png")
        //.attr("wmode", "transparent")
        .attr("height", function(d) {
            if(d.type != "other.utilization") {
                return 0;
            }
            return rawData.scale.y.rangeBand();
        })
        .attr("width", function(d) { return rawData.scale.y.rangeBand(); })
        .attr("x", function(d){
            return rawData.scale.x_tree(rawData.layout.treetitle[1])+d.level*rawData.layout.indentation;
        })
        .attr("y", function(d){
            return rawData.layout.offsetYforUtilizationImage;
        });
    };

    gantt.timeDomain = function(value) {
        if (!arguments.length)
        return [ timeDomainStart, timeDomainEnd ];
        timeDomainStart = value[0], timeDomainEnd = value[1];
        return gantt;
    };

    gantt.rawData = function(value) {
        rawData = value;
        return gantt;
    };

    return gantt;

   
    
    
    function adjustY(y, range)
    {
        if(y<range[0])
        return 0;
        for(var i = 1 ; i < range.length; i++)
        {
            if(y<range[i])
            {
                var middle = (range[i-1] + range[i])/2;
                return ( y - middle ) > 0? i:i-1;
            }

        }
        return range.length-1;
    }
}

function getStartDate(rawData) {
    var startDate = Date.now();

    if (rawData.tasks.length > 0) {
        rawData.tasks.sort(function(a, b) {
            return a.startDate - b.startDate;
        });
        startDate = rawData.tasks[0].startDate;
    }

    return startDate;
}

function getEndDate(rawData) {
    var lastEndDate = Date.now();

    if (rawData.tasks.length > 0) {
        rawData.tasks.sort(function(a, b) {
            return a.endDate - b.endDate;
        });
        lastEndDate = rawData.tasks[rawData.tasks.length - 1].endDate;
    }

    return lastEndDate;
}
