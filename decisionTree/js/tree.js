var margin = {
	top : 0,
	right : 320,
	bottom : 0,
	left : 0
}, width = 800 - margin.left - margin.right, height = 640 - margin.top
		- margin.bottom;
var i = 0,root,nodes,link,node,SelectedNode,max_height,max_width;		

//modify js : d3.v3.js add the attr "elementsize" 
var tree = d3.layout.tree().separation(function(a, b) {
	return a.parent === b.parent ? 1 : .5;
}).children(function(d) {
	return d.paths;
}).size(null) //.size([ height, width ])
.elementsize([200,200]); // refer the lib/d3.v3.js line 5778 to 5905

var svg = d3.select("#tree_container").append("svg").attr("width",
		width + margin.left + margin.right).attr("height",
		height + margin.top + margin.bottom).attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

d3.json("data/tree.json", function(json) {
	root = flatten(json);
	update(root);
});

function update(source){
	// Empty form values on update
	$("#node_name").val("");
	$("#node_description").val("");
	$("#node_probability").val("");
	$("#node_value").val("");
	SelectedNode = null;

	svg.selectAll(".link").remove();
	svg.selectAll(".node").remove();
	
	nodes = tree.nodes(source);
	
	// update svg acording to tree height & width
	max_height = d3.max(nodes, function(d){ return d.x;});
	max_width = d3.max(nodes, function(d){ return d.y;});

	svg.attr("width",max_width + margin.left + margin.right)
		.attr("height",max_height + margin.top + margin.bottom + 100);
	
	link = svg.selectAll(".link").data(tree.links(nodes)).enter().append("path")
			.attr("class", "link").attr("d", elbow);

	node = svg.selectAll(".node").data(nodes).enter().append("g").attr("class", "node")
			.style("cursor","pointer").on("click", function(d){selectNode(d);})
			.on("contextmenu", function(d) {
				selectNode(d);
			    d3.event.preventDefault();
			})
			.attr("transform", function(d) {return "translate(" + d.y + "," + d.x + ")";});

	node.append("text").attr("class", "name").attr("x", 8).attr("y", -6).text(
			function(d) {
				if(d.name.length > 25){
					return d.name.substr(0,23)+"..";
				}
				return d.name;
			});

	node.append("text").attr("x", 8).attr("y", 8).attr("dy", ".7em").text(
			function(d) {
				if (d.value != null) {
					return 'Outcome: $' + d.value;
				}
			});

	node.append("text").attr("x", 8).attr("y", 8).attr("dy",function(d){
		var valcout = 0;
		if(d.value!=null)valcout++;
		return (valcout+0.7)+'em';
	}).text(
			function(d) {
				if (d.probability == null) {
					return '';
				} else {
					return 'Probability: ' + 100.0 * d.probability + '%';
				}
			});

	node.append("text").attr("x", 8).attr("y", 8).attr("dy",function(d){
	 	var valcout = 0;
		if(d.value!=null)valcout++;
		if(d.probability!=null)valcout++;
		return (valcout+0.7)+'em';
	 }).text(
			function(d) {
				if (d.description == null) {
					return '';
				} else {
					if(d.description.length > 25){
						return d.description.substr(0,23)+"..";
					}
					return d.description;
				}
			});

		node.append("text").attr("x", 8).attr("y", 8).attr("dy", function(d){
			var valcout = 0;
			if(d.value!=null)valcout++;
			if(d.probability!=null)valcout++;
			if(d.description!=null)if(d.description.length > 0)valcout++;
			return (valcout+0.7)+'em';
		}).text(
			function(d) {
				if (d.expected == null) {
					return '';
				} else {
					var expected = 'Expected value: $'+d.expected;
					if(expected.length > 25){
						return expected.substr(0,23)+"..";
					}
					return expected;
				}
			});

	node.append("title").text(function(d){
		var toolTip = d.name+'\n';
		if (d.value != null) {
			toolTip += 'Outcome: $'+ d.value+'\n';
		}
		if (d.probability != null) {
			toolTip += 'Probability: '+ 100.0 * d.probability +'% \n';
		}
		if (d.description!=null) {
			if(d.description.length > 0)
				toolTip += wbr(d.description,40) +'\n';	
		}
		if (d.expected!=null){
			toolTip += 'Expected value: $'+ d.expected+'\n';
		}
		return toolTip;
	});
	

	$('g.node').contextMenu('nodeContextMenu',
    {
        bindings:
        {
            'edit': function(t) {
                $("#editNode").dialog({
                    modal: true,
                    title:'Edit node',
                    position:'center'
                });
                selectNode(SelectedNode);
                $("#formSubmitBtn").text("Update");
                $("#formSubmitBtn").val("update");

                if(t.__data__.paths && t.__data__.paths.length > 0){
					$("#node_value").attr('readOnly','true');
				}else{
					$("#node_value").removeAttr('readOnly');
				}
                
            },
            'add': function(t) {
                if(t.__data__.value && t.__data__.value > 0){
                	$('#message_data').dialog({
				    	modal: true,
				        title:'Warning message',
				        position:'center'
				    });
				    $('#messageString').text("This node has an outcome value and cannot have children nodes");
                }else{
                	$("#editNode").dialog({
	                    modal: true,
	                    title:'Add new node',
	                    position:'center'
	                });
	                $("#node_value").removeAttr('readOnly');
	                selectNode(SelectedNode);
	                $("#formSubmitBtn").text("Add Node");
	                $("#formSubmitBtn").val("add");
	                clearForm();
                }
                
            },
            'remove': function(t) {
                $("#formSubmitBtn").val("remove");
                updateNodes();
            }
        }
    });

	trackIssues();
}

function elbow(d, i) {
	return "M" + d.source.y + "," + d.source.x + "H" + d.target.y + "V"
			+ d.target.x + (d.target.children ? "" : "h" + (margin.right/2));
}

// function for word wrap 
function wbr(str, num) {  
  return str.replace(RegExp("(\\w{" + num + "})(\\w)", "g"), function(all,text,char){
    return text +'\n'+ char;
  });
}

function clearForm(){
	$("#node_name").val("");
	$("#node_description").val("");
	$("#node_probability").val("");
	$("#node_value").val("");
}

function selectNode(d){
	SelectedNode = d;
	$("#node_name").val(d.name);
	if (d.description != null) {
		$("#node_description").val(d.description);
	}else{
		$("#node_description").val("");
	}

	if (d.probability != null) {
		$("#node_probability").val(d.probability);
	}else{
		$("#node_probability").val("");
	}
	
	if (d.value != null) {
		$("#node_value").val(d.value);
	}else{
		$("#node_value").val("");
	}
}

function flatten(root) {
  function recurse(node) {

    if (node.paths && node.paths.length > 0){
    	node.paths.forEach(recurse);
    }
    if (!node.id) node.id = ++i;

    if (node.paths && node.paths.length > 0){
    	var tev = 0;
    	for(var j in node.paths){
    		tev = tev + (node.paths[j].expected * node.paths[j].probability);
    	}
    	node.expected = tev;
    }else{
    	if(node.value == null){
    		node.value = 0;	
    	}

    	if(node.value != null && node.probability != null){
    		node.expected = node.value;
    	}else{
    		node.expected = 0;
    	}
    }
  }
  recurse(root);
  return root;
}

function updateNodes(){
	
	if(formValidation()){
		var editOption = $('#formSubmitBtn').val();
		if (SelectedNode==null){
			$("#editNode").dialog('close');
			return false;
		}else{
			function recurse(node) {
				if(node.id == SelectedNode.id){
					switch(editOption){
					case "update":
						if($("#node_name").val().length > 0){
							node.name = $("#node_name").val();
						}
						if($("#node_description").val().length > 0){
							node.description = $("#node_description").val();
						}else{
							node.description = null;
						}
						
						if ($("#node_probability").val().length > 0) {
							node.probability = $("#node_probability").val();	
						}else{
							node.probability = null;
						}
						if ($("#node_value").val().length > 0) {
							node.value = $("#node_value").val();	
						}else{
							node.value = null;
						}
						$("#editNode").dialog('close');
						break;
					case "add":
						var children= new Object();
						children.name = $("#node_name").val();
						children.description = $("#node_description").val();
						children.probability = $("#node_probability").val();
						if($("#node_value").val().length > 0)
							children.value = $("#node_value").val();
						else
							children.value = 0;
						children.id =  ++i;

						if(children.value != null && children.probability != null){
				    		children.expected = children.value;
				    	}else{
				    		children.expected = 0;
				    	}

						if(node.paths && node.paths.length > 0){
							node.paths.push(children);
						}else{
							node.paths = [children];
						}
						$("#editNode").dialog('close');
						break;
					case "remove":
						if(node.parent){
							var temppath = node.parent.paths;
							temppath.splice(temppath.indexOf(node),1);
						}
					break;	
					default:
							console.log(editOption+" is not a option");
					}	

					if (node.paths && node.paths.length > 0){
				    	var tev = 0;
				    	for(var j in node.paths){
				    		tev = tev + (node.paths[j].expected * node.paths[j].probability);
				    	}
				    	
				    	node.expected = tev;
				    }else{
				    	if(node.value == null){
				    		node.value = 0;	
				    	}
				    	if(node.value != null && node.probability != null){
				    		node.expected = node.value;
				    	}else{
				    		node.expected = 0;
				    	}
				    }
				}else{
					if (node.paths && node.paths.length > 0){
		    			node.paths.forEach(recurse);	
		    		}
		    		
		    		if (node.paths && node.paths.length > 0){
				    	var tev = 0;
				    	for(var j in node.paths){
				    		tev = tev + (node.paths[j].expected * node.paths[j].probability);
				    	}
				    	node.expected = tev;
				    }else{
				    	if(node.value == null){
				    		node.value = 0;	
				    	}
				    	if(node.value != null && node.probability != null){
				    		node.expected = node.value;
				    	}else{
				    		node.expected = 0;
				    	}
				    }
				}
	  		}
	  		recurse(root);
	  		update(root);
		}
		return false;
	}else{
		return false;
	}
	
}

function jsonString(){
	var seen = []
	// try to safe refrense of object 
	var temp = JSON.stringify(root, function(key, val) {
	   if (typeof val == "object") {
	        if (seen.indexOf(val) >= 0)
	            return undefined
	        seen.push(val)
	    }
	    return val
	});

	var jsonObject = JSON.parse(temp);
	var json = JSON.stringify(clearJsonData(jsonObject), function(key, val) {
	   if (typeof val == "object") {
	        if (seen.indexOf(val) >= 0)
	            return undefined
	        seen.push(val)
	    }
	    return val
	});
	$('#message_data').dialog({
    	modal: true,
        title:'JSON of current tree',
        position:'center',
        width:500
    });
    $('#messageString').text(json);
};

function clearJsonData(json){
	function recurse(node_) {
	    if (node_.paths && node_.paths.length > 0){
	    	node_.paths.forEach(recurse);
	    }
	    if (node_.id != null){delete node_.id;};
	    if (node_.children != null){delete node_.children;};
	    if (node_.x != null){delete node_.x;};
	    if (node_.y != null){delete node_.y;};
	    if (node_.depth != null){delete node_.depth;};
	  }
	  recurse(json);
	  return json;
}

function trackIssues(){
	var errorMsg ='';
	function recurse(node_) {
	    if (node_.paths && node_.paths.length > 0){
	    	node_.paths.forEach(recurse);
	    }else{
    		if(node_.value == null){
    			errorMsg += "*Leaf node '"+node_.name+"' value should not be null <br/>";
    		}
	    }
	    if(node_.paths && node_.paths.length > 0){
    		var sum_of_p = 0.0;
	    	for(var j in node_.paths){
	    		sum_of_p = sum_of_p + parseFloat(node_.paths[j].probability);
	    	}
		    if(sum_of_p > 1){
		    	errorMsg += "*Sumation of probability of child nodes of '"+node_.name+"' is greater then 100% <br/>";
		    }

		    if(sum_of_p < 1){
		    	errorMsg += "*Sumation of probability of child nodes of '"+node_.name+"' is less then 100% <br/>";
		    }
	    }
	  }
	  recurse(root);
	  $("#errors").html(errorMsg);
}

function formValidation(){
	var valid = true;
	
	if($("#node_name").val().length < 1){
		valid = false;
	}

	if($("#node_probability").val().length < 1){
		valid = false;
	}else{
		if(isNaN($("#node_probability").val())){
			$("#node_probability").val("");
			$("#node_probability").focus();
			valid = false;
		}
	}

	if($("#node_value").val().length > 0){
		if(isNaN($("#node_value").val())){
			$("#node_value").val("");
			$("#node_value").focus();
			valid = false;
		}	
	}
	
	return valid;
}

function isNumberKey(input,evt){
	
	if( evt.keyCode == 37 || 
		evt.keyCode == 38 ||
		evt.keyCode == 39 || 
		evt.keyCode == 40){
		return true;
		}

    var charCode = (evt.which) ? evt.which : event.keyCode
    if(charCode == 46){
    	var temp = $('#'+input.id).val().toString();
    	if(temp.length > 0){
    		if(temp.indexOf('.') > 0){
    			return false;
    		}	
    	}
    	return true;
    }
    	
    if (charCode > 31 && (charCode < 48 || charCode > 57 ) )
        return false;
    return true;
}

function numbersOnly(Sender,evt,isFloat,isNegative) {
    if(Sender.readOnly) return false;       

    var key   = evt.which || !window.event ? evt.which : event.keyCode;
    var value = Sender.value;

    if((key == 46 || key == 44) && isFloat){                
        var selected = document.selection ? document.selection.createRange().text : "";
        if(selected.length == 0 && value.indexOf(".") == -1 && value.length > 0) Sender.value += ".";
        return false;
    }
    if(key == 45) { // minus sign '-'
        if(!isNegative) return false;
        if(value.indexOf('-')== -1) Sender.value = '-'+value; else Sender.value = value.substring(1);
        if(Sender.onchange != null) {
            if(Sender.fireEvent){
                Sender.fireEvent('onchange');
            } else {
                var e = document.createEvent('HTMLEvents');
                    e.initEvent('change', false, false);
                Sender.dispatchEvent(e);
            }
        }

        var begin = Sender.value.indexOf('-') > -1 ? 1 : 0;
        if(Sender.setSelectionRange){
            Sender.setSelectionRange(begin,Sender.value.length);
        } else {
            var range = Sender.createTextRange();
            range.moveStart('character',begin);
            range.select();                 
        }

        return false;
    }
    if(key > 31 && (key < 48 || key > 57)) return false;
}
