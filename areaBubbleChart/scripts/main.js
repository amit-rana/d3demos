var margin = {t:30, r:50, b:20, l:60 },
w = 1366 - margin.l - margin.r,
h = 768 - margin.t - margin.b,
x,
y,
xr,
yr,
rScale,
xoffset,
yoffset,xtotal,ytotal,ftotal;
color = d3.scale.category10();
var svg = d3.select("#chart").append("svg")
	.attr("width", w + margin.l + margin.r)
	.attr("height", h + margin.t + margin.b);

var xAxis;
var yAxis;
var xAxisr;
var yAxisr;
var groups;
var data;
var areaData;

	d3.json('data/data.json', function(json){
		if (json) {
			setupAxis(json);
			areaData = json.areas;
			data = json.data;

			data.sort(function(a, b) { return d3.ascending(a.y, b.y); })
			data.sort(function(a, b) { return d3.ascending(a.x, b.x); })
			update(data);
		}
	});

	function getColor(color){
		colorCode = {};
		switch (color) {
		    case "red":
		        colorCode.hex = "#FF0000"; 
		        colorCode.rgb = "rgba(255,0,0,0.3)"
		        break;
		    case "orange":
		        colorCode.hex = "#FF9933"; 
		        colorCode.rgb = "rgba(255,153,51,0.3)"
		        break;
		    case "yellow":
		        colorCode.hex = "#FFFF33"; 
		        colorCode.rgb = "rgba(255,255,51,0.3)"
		        break;
		    case "green":
		        colorCode.hex = "#00FF33";
		        colorCode.rgb = "rgba(0,255,51,0.3)"
		        break;
		    case "dark-green":
		        colorCode.hex = "#006633";
		        colorCode.rgb = "rgba(0,105,51,0.3)"
		        break;
		    case "blue":
		        colorCode.hex = "#00CCFF";
		        colorCode.rgb = "rgba(0,204,255,0.3)"
		        break;
		    default:
		    	colorCode.hex = "#00CCFF";
		    	colorCode.rgb = "rgba(0,204,255,0.3)"
		    	break;     
		}
		return colorCode;
	}

	function setupAxis(json){

		var x_data = json["x-axis"];
		var X_ticks = x_data.ticks;

		var y_data = json["y-axis"];
		var Y_ticks = y_data.ticks;

		var x_total_data = json["x-axis-totals"];
		var X_total_ticks = x_total_data.values;

		var y_total_data = json["y-axis-totals"];
		var Y_total_ticks = y_total_data.values;

		xtotal = X_total_ticks.map(function(d) {
		    return {
		      "xtotal": d[1]
		    };
		  });

		ytotal = Y_total_ticks.map(function(d) {
		    return {
		      "ytotal": d[1]
		    };
		  });	
		ftotal = [{"ftotal":json.chart.total}]
		var x_vals = [];
		var temp1 = X_ticks.map(function(d){return d[0][0];});
		for(q in temp1){ if(x_vals.indexOf(temp1[q]) < 0) x_vals.push(temp1[q]);}
		x_vals.push(x_data.range[1]);
		xoffset = w/x_vals.length;
		var xScal = [];
		for (var i = 0; i < x_vals.length; i++) {
			xScal.push(i*(xoffset));
		}

		// get domain and scal for y-axis
		var y_vals = [];
		var temp1 = Y_ticks.map(function(d){return d[0][0];});
		for(q in temp1){if(y_vals.indexOf(temp1[q]) < 0) y_vals.push(temp1[q]);}
		y_vals.push(y_data.range[1]);
		yoffset = (h-(margin.t/2))/y_vals.length;
		var yScal =[];
		for (var j = 0; j < y_vals.length; j++) {
			yScal.push(j*(yoffset));
		};
		yScal.reverse();

		x = d3.scale.linear();
		x.domain(x_vals).range(xScal);

		xAxis = d3.svg.axis()
			.scale(x)
            .tickValues(x_vals)
			.orient("bottom");

		y = d3.scale.linear();
		y.domain(y_vals).range(yScal);

		yAxis = d3.svg.axis()
			.scale(y)
            .tickValues(y_vals)
			.orient("left");

		//==========================/
		// get domain and scal for x-Show value axis
		var x_vals1 = [];
		var temp1 = X_ticks.map(function(d){return d[1];});
		for(q in temp1){ if(x_vals1.indexOf(temp1[q]) < 0) x_vals1.push(temp1[q]);}
		var xScal1 = [];
		for (var i = 0; i < x_vals1.length; i++) {
			xScal1.push(i*(xoffset));
		}

		// get domain and scal for y-axis
		var y_vals1 = [];
		var temp1 = Y_ticks.map(function(d){return d[1];});
		for(q in temp1){if(y_vals1.indexOf(temp1[q]) < 0) y_vals1.push(temp1[q]);}

		var yScal1 =[];
		for (var j = 0; j < y_vals.length; j++) {
			yScal1.push(j*(yoffset));
		};
		yScal1.reverse();

		xr = d3.scale.ordinal();
		xr.domain(x_vals1).range(xScal1);

		xAxisr = d3.svg.axis()
			.scale(xr)
            .tickValues(x_vals1)
			.orient("bottom");

		yr = d3.scale.ordinal();
		yr.domain(y_vals1).range(yScal1);

		yAxisr = d3.svg.axis()
			.scale(yr)
            .tickValues(y_vals1)
			.orient("left");

		rScale = d3.scale.linear()
                .domain([0, d3.max(json.data, function(d) { return d.size; })])
                .range([3, 10]);
	}

	function update(dataToRender){
		// remove old chart data
		svg.selectAll("rect").remove();
		svg.selectAll("text").remove();
		svg.selectAll("path").remove();
		svg.selectAll("g.x").remove();
		svg.selectAll("g.y").remove();
		svg.selectAll("g.grid").remove();
		svg.selectAll("circle").remove();

		svg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.l + "," + (h - 60 + margin.t) + ")")
        .call(make_x_axis()
            .tickSize( (-h + margin.t + margin.b), 0, 0)
            .tickFormat("")
        )

    	svg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.l + "," + margin.t + ")")
        .call(make_y_axis()
            .tickSize( (-w + margin.l),0, 0)
            .tickFormat("")
        )

        var line ,area;	
		for(AR in areaData){
			var f_area = areaData[AR];
			
			if(f_area.fill){
				area = d3.svg.area();
				if(f_area.fill == "above"){
					area
						.x(function(d) {return x(+d[0])+margin.l; })		    
				    	.y0(function(d) {return y(+d[1]); })
				    	.y1(margin.t);
				}else{
					area
						.x(function(d) {return x(+d[0])+margin.l; })		    
				    	.y0(h- margin.b-10)
				    	.y1(function(d) {return y(+d[1]); });
				}
				    
				svg.append("g").append("path")
		        	.datum(f_area.verticies)
		        	.attr("class", "area")
		        	.attr("d", area)
		        	.style("opacity",0.2)
		        	.style("fill", function(d) { return getColor(f_area.color).rgb; });
			}
		
       	 line = d3.svg.line()
    		.x(function(d) { return x(+d[0])+margin.l; })
    		.y(function(d) { return y(+d[1]); });

    		if(f_area.style){
    			svg.append("g").append("path")
				.attr("class", "line")
				.attr("d", line(f_area.verticies))
				.attr("class", "line")
		        .style("stroke",  function(d) { return getColor(f_area.color).hex; })
		        .style("stroke-dasharray", ("3, 3"))
		        .style("stroke-width",2)
		        .attr('fill', 'none');
			}else{
				svg.append("g").append("path")
				.attr("class", "line")
				.attr("d", line(f_area.verticies))
				.attr("class", "line")
	            .style("stroke",  function(d) { return getColor(f_area.color).hex; })
	            // .style("stroke-width",2)
	            .attr('fill', 'none');
			}
            
		}
		groups = svg.append("g").attr("transform", "translate(" + margin.l + "," + margin.t + ")");
		// style the circles, set their locations based on data
		var circles = groups.selectAll("circle")
			.data(dataToRender)
		  .enter();

		  circles.append("circle")
		  .attr("class", "circles")
		  .attr({
			cx: function(d) { return x(+d.x); },
			cy: function(d) { return y(+d.y); },
			r: function(d){ return rScale(d.size);},
			id: function(d) { return d.size+"_"+d.x+"_"+d.y; }
		  })
			.style("fill", function(d) { return getColor(d.color).rgb; })
			.attr("stroke",function(d) { return getColor(d.color).hex; })
			.attr("stroke-width",0.6)
			.append("title")
				.text(function(d) { return "x:"+d.x+" y:"+d.y; });

		circles.append("line")
			.attr("x1",function(d){ return x(+d.x);})
			.attr("y1",function(d){ return y(+d.y)-3;})
			.attr("x2",function(d){ return x(+d.x);})
			.attr("y2",function(d){ return y(+d.y)+3;})
			.style("fill",function(d) { return getColor(d.color).hex;})
			.style("stroke",function(d) { return getColor(d.color).hex;})
			.style("stroke-width",1);

		circles.append("line")
			.attr("x1",function(d){ return x(+d.x)-3;})
			.attr("y1",function(d){ return y(+d.y);})
			.attr("x2",function(d){ return x(+d.x)+3;})
			.attr("y2",function(d){ return y(+d.y);})
			.style("fill",function(d) { return getColor(d.color).hex;})
			.style("stroke",function(d) { return getColor(d.color).hex;})
			.style("stroke-width",1);


		// draw axes and axis labels
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + margin.l + "," + (h + margin.t) + ")")
			.call(xAxisr)
			.selectAll("text")
			.attr("x", xoffset/2);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
			.call(yAxisr)
			.selectAll("text")
			.attr("y", -(yoffset/2));

		// svg.append("g")
		// 	.attr("class", "x axis")
		// 	.attr("transform", "translate(" + margin.l  + "," + (h - 30 + margin.t + 20) + ")")
		// 	.call(xAxis);

		// svg.append("g")
		// 	.attr("class", "y axis")
		// 	.attr("transform", "translate(" + (margin.l - 20) + "," + margin.t + ")")
		// 	.call(yAxis);

		var xtotalAxis = svg.append("g")
	      .attr("class", "legend")
	      .attr("height", yoffset)
	      .attr("width", w )
	    .attr('transform', 'translate('+ (margin.l)+','+(-margin.l)+')')    
	    
	    xtotalAxis.selectAll('rect')
	      .data(xtotal)
	      .enter()
	      .append("rect")
	      .attr("x", function(d, i){ return i *  xoffset;})
	      .attr("y", h + margin.t + 1)
	      .attr("width", xoffset-1)
	      .attr("height", yoffset-1)
	      .style("fill", function(d) {        
	        return getColor("blue").rgb;
	      })
	      
	    xtotalAxis.selectAll('text')
	      .data(xtotal)
	      .enter()
	      .append("text")
	      .attr("x", function(d, i){ return (i * xoffset) + ((xoffset)/2)-4;})
	      .attr("y", h + margin.t + (yoffset/2)+4)
	      .text(function(d) {
	        return d.xtotal;
	    });

	    var ytotalAxis = svg.append("g")
	      .attr("class", "legend")
	      .attr("height", h)
	      .attr("width", xoffset )
		    .attr('transform', 'translate('+ (-margin.r)+','+(margin.t)+')')    
	    ytotalAxis.selectAll('rect')
	      .data(ytotal)
	      .enter()
	      .append("rect")
	      .attr("x", w  + margin.l + 1)
	      .attr("y", function(d, i){ return i *  yoffset;} )
	      .attr("width", xoffset-1)
	      .attr("height", yoffset-1)
	      .style("fill", function(d) {        
	        return getColor("blue").rgb;
	      })
	      
	    ytotalAxis.selectAll('text')
	      .data(ytotal)
	      .enter()
	      .append("text")
	      .attr("text-anchor","middle")
	      .attr("x", w + margin.l + (xoffset/2))
	      .attr("y", function(d, i){ return (i * yoffset) + ((yoffset)/2)+4;})
	      .text(function(d) {
	        return d.ytotal;
	    });

	    var finaltotalAxis = svg.append("g")
	      .attr("class", "legend")
	      .attr("height", yoffset -2)
	      .attr("width", xoffset -2)
		    .attr('transform', 'translate('+ (-margin.r)+','+(-margin.l)+')') 

	    finaltotalAxis.selectAll('rect')
	      .data(ftotal)
	      .enter()
	      .append("rect")
	      .attr("x", w + margin.l + 1.5)
	      .attr("y", h + margin.t + 1)
	      .attr("width", xoffset-1)
	      .attr("height", yoffset-1)
	      .style("fill", function(d) {        
	        return getColor("blue").rgb;
	      })
	      
	    finaltotalAxis.selectAll('text')
	      .data(ftotal)
	      .enter()
	      .append("text")
	      .attr("text-anchor","middle")
	      .attr("x", w + margin.l + (xoffset/2))
	      .attr("y", h + margin.t + (yoffset/2)+4)
	      .text(function(d) {
	        return d.ftotal;
	    });
	    
	        
	}

	function make_x_axis() {        
	    return d3.svg.axis()
	        .scale(xr)
	         .orient("bottom")
	         .ticks(26)
	}

	function make_y_axis() {        
	    return d3.svg.axis()
	        .scale(yr)
	        .orient("left")
	        .ticks(15)
	}