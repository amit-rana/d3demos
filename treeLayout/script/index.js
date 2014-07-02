
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;
    
var i = 0,
    duration = 500,
    root;

var tree = d3.layout.tree()
        .separation(function(a, b) {
          return a.parent === b.parent ? 1 : 0.8;
        })
        .size([height, width])
        .nodeSize([80,80]);

// var color = d3.scale.category10();        

var elbow = function (d, i){
      var source = nodeObject(d.source);
      var target = nodeObject(d.target);
      var hy = (target.y-source.y);
      return "M" + (source.y+25) + "," + source.x
             + "H" + (source.y+hy)
             + "V" + target.x + "H" + (target.y+25);
    };
var connector = elbow;
var nodeObject = function(d){
  return {x : d.x, y : d.y};
};

var svg = d3.select("body #courseTree").append("svg")
    .attr("id","main")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + ((height / 2) + margin.top) + ")");

function update(source) {
   duration = d3.event && d3.event.altKey ? 5000 : 500;
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 220;});

  //reset svg 
  max_height = d3.max(nodes, function(d){ 
    if(d.x < 0){return ((d.x) * -1);}
    return d.x;
  });
  max_width = d3.max(nodes, function(d){ 
    return d.y;
  });
  max_height = max_height + margin.top + margin.bottom + 600;
  max_width = max_width + margin.left + margin.right + 100;
  updateSVG(max_height,max_width);

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("svg:rect")
      .attr("y",function(d){
        if(d.url){
          return -((d.recHeight+12)/2);
        }
        return -(d.recHeight/2);
      })
      .attr("x",20)
      .attr("height",function(d){
        if(d.url)
          return d.recHeight + 12;
        return d.recHeight;
      })
      .attr("ry",10)
      .attr("width",function(d){
        return d.recWidth;
      })
      .style("fill-opacity", 1e-6)
      .attr('stroke','white')
      .style('fill','white');
      
  //append text element
  nodeEnter.append(function(d){return d.svgText;})
      .attr("y",-10)
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return "start";})
      .style("fill-opacity", 1e-6);

  nodeEnter.filter(function(d) { return d.url })
    .append("a")
     .attr("xlink:href", function (d) { if(d.url){return d.url} })
    .append("text")
    .attr("text-anchor", "left")
    .attr("x", 25)
    .attr("y", function(d, i) { return d.linkPos;})
    .attr("dx", 0)
    .attr("dy", "1em")
    .text("More..")
    .style("fill-opacity", 1e-6)
    .attr("fill", "Blue");

  nodeEnter.append("title").text(function(d){
    if(d.detail) return d.name +"\n\n"+d.detail;
    else return d.name;
  });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  nodeUpdate.select("rect")
      .style("fill-opacity", 1)
      .attr('stroke',function(d,i){
      	return d.colorCode;
      })
      .style('fill', 'white');

  nodeUpdate.select("a text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  nodeExit.select("rect")
      .attr('stroke','white')
      .style("fill-opacity", 1e-6);
  nodeExit.select("a text")
    .style("fill-opacity", 1e-6);        

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });
      
  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .style("stroke",function(d,i){
        return d.source.colorCode;
      })
      .transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: d.source.x0, y: d.source.y0};
        return connector({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", connector);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = nodeObject(d.source||source);
        o.y = (d.target.y - d.target.recWidth);
        return connector({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
  
}

function updateSVG(height,width){
    d3.select("body .tree svg").attr("width",width).attr("height",height);
    svg.attr("transform", "translate(" + margin.left + "," +(height / 2)+ ")"); 
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function createSVGtext(caption, x, y,isurl) {
    //  This function attempts to create a new svg "text" element, chopping 
    //  it up into "tspan" pieces, if the caption is too long
    //
    var svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgText.setAttributeNS(null, 'x', x);
    svgText.setAttributeNS(null, 'y', y);
    svgText.setAttributeNS(null, 'font-size', 12);
    svgText.setAttributeNS(null, 'fill', '#000000');
    svgText.setAttributeNS(null, 'text-anchor', 'start');

    //  The following two variables should really be passed as parameters
    var MAXIMUM_CHARS_PER_LINE = 30;
    var LINE_HEIGHT = 16;
    if(caption.length > 80){
      caption = caption.substr(0,77);
      caption += "...";
    }
    var words = caption.split(" ");
    var line = "";

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        
        if (testLine.length > MAXIMUM_CHARS_PER_LINE)
        {
            //  Add a new <tspan> element
            var svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            svgTSpan.setAttributeNS(null, 'x', x);
            svgTSpan.setAttributeNS(null, 'y', y);
            var tSpanTextNode = document.createTextNode(line);
            svgTSpan.appendChild(tSpanTextNode);
            svgText.appendChild(svgTSpan);

            line = words[n] + " ";
            y += LINE_HEIGHT;
        }
        else {
            line = testLine;
        }
    }

    var svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    svgTSpan.setAttributeNS(null, 'x', x);
    svgTSpan.setAttributeNS(null, 'y', y);

    var tSpanTextNode = document.createTextNode(line);
    svgTSpan.appendChild(tSpanTextNode);

    svgText.appendChild(svgTSpan);
    //calculate the width of text
    document.getElementById("main").appendChild(svgText);
    var d = svgText.getBBox()
    var width = d.width;
    document.getElementById("main").removeChild(svgText);

    var org = {};
    
    if(y == 0) org.height = 20;
    else org.height = y + 15;
    var linkTemp = y;
    for (var l = 0; l < svgText.TEXT_NODE; l++) {
       if(svgText.childNodes[l] != undefined){
          yN = svgText.childNodes[l].getAttribute('y');
          if(isurl){
            yN = yN - (org.height/2) + 3;
          }else{
            yN = yN - ((org.height-12)/2) + 3;  
          }
          svgText.childNodes[l].setAttributeNS(null, 'y', yN);
          linkTemp = yN;
       }
    }


    org.width = width + 10;
    org.svgText = svgText;

    if(linkTemp < 0){ org.linkPos = linkTemp + 7; }
    else{ org.linkPos = linkTemp + 3; }

    return org;
}

function flatten(root) {
  var i = 0;
    var code = "#f404d7";
  if(root.colorCode) code = root.colorCode;
  function recurse(node) {
    if (node.children && node.children.length > 0){
      node.children.forEach(recurse);
    }
    var text 
    if(node.url){
      text = createSVGtext(node.name,25,0,true);
    }else{
      text = createSVGtext(node.name,25,0,false);
    }
        
    if (!node.id) node.id = ++i;
    if (!node.recHeight) node.recHeight = text.height;
    if (!node.recWidth) node.recWidth = text.width;
    if (!node.svgText) node.svgText = text.svgText;
    if (!node.linkPos) node.linkPos = text.linkPos;
    if (!node.colorCode) node.colorCode = code;
  }
  recurse(root);
  return root;
}

//entry point, you can  add this below part replace "data.json" with your response json url

d3.json("data/data.json", function(error, json) {
  root = flatten(json);
  update(root);
});

// d3.json("http://www.webashlar.com/Demos/Tax/input1.json", function(error, json) {
//   root = flatten(json);
//   update(root);
// });