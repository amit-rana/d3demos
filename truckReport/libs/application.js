
var oRawData = {
    layout : {
        treeactualwidth : 379,
        treewidth : 379,
        initialwidth : 1108,
        width : 1108,
        height : 1000,
        handlingheight : 0,
        hspace : 2,
        vspace : 3,
        hsplit : 30,
        vsplit : 60,
        voffset : 0,
        hoffset : 0.5,
        zoomrate : 1,
        margin : {
            top : 0, //20,
            right : 0, //40,
            bottom : 0, //20,
            left : 0
        },
        tickFormat : "%m-%d",
        offsetpos : 0,
        head : 25,
        utiflag : 0,
        treetitle : ["icon", "name", "defaultdriver", "plate"],
        treetitletext : ["Icon", "Name", "Driver", "Plate#"],
        offsetYforText : 7,
        offsetYforTriangle : 12,
        offsetYforUtilizationText : 15,
        offsetYforUtilizationImage : 8,
        utilizationbandcount : 3,
        indentation : 10,
        imageindentation : 30,
        backcolorcount : 0,
    },
    time : {
        domain : [,],
        initialdomain : [,],
        interval : d3.time.days,
        tick : 1,
    },
    resources : [],
    drivers : [
    {
        id : "driver1",
        name : "Driver 1",
        desc : "It's Driver1",
        type : "driver",
    }],
    locations : [],
    units : [],
    utasks : [],
    tasks : [
    {
        id : "travel1",
        name : "Travel 1",
        desc : "It's Travel1",
        type : "task.travel",
        driver : "driver1",
        taskName : "truck1",
        startDate : new Date("Sun Dec 09 01:36:45 EST 2012"),
        endDate : new Date("Sun Dec 09 22:36:45 EST 2012"),
        status : "FAILED",
        type : "task.travel",
        cargo : [],
    }],
    taskCategories : {
        "SUCCEEDED" : "bar",
        "FAILED" : "bar-failed",
        "RUNNING" : "bar-running",
        "KILLED" : "bar-killed",
        "BG" : "bar-backgroud",
        "LOAD" : "bar-load",
        "UNLOAD" : "bar-unload",
        "TRAVEL" : "bar-travel",
    },
    taskNames : [],
    taskStatus : [],
    svg : {
        svg_tree : null,
    },
    scale : {
        x : null,
        y : null,
        xaxis : null,
        yaxis : null,
        x_tree : null,
    },
};

function buildTreeTable() {
    var treeTableStr = "<table id='example-basic-expandable'><thead><tr><th>Name</th><th>Driver</th><th>Plate</th></tr></thead><tr data-tt-id='0'>           <td>truck1</td>		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>		<tr data-tt-id='1'>          <td>truck2</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>		<tr data-tt-id='2'>          <td>truck3</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>		<tr data-tt-id='3'>          <td>truck4</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>		<tr data-tt-id='4'>          <td>truck5</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>	    <tr data-tt-id='5'>          <td>truck6</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>        <tr data-tt-id='6'>          <td>truck7</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>        <tr data-tt-id='7'>          <td>truck8</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>		        <tr data-tt-id='8'>"+
    "<td>truck9</td>		  		   <td>Hans Mayer</td>		   <td>#CO-AC 1122</td>        </tr>					        <tr data-tt-id='100' data-tt-parent-id='8'>          <td colspan='3'><img src='images/chart.jpg' width='30' height='30'></img>Utilization</td>        </tr>		<tr data-tt-id='100' data-tt-parent-id='7'>          <td>Utilization</td>        </tr>		   <tr data-tt-id='100' data-tt-parent-id='6'>          <td>Utilization</td>        </tr>   <tr data-tt-id='100' data-tt-parent-id='5'>          <td>Utilization</td>        </tr>   <tr data-tt-id='100' data-tt-parent-id='4'>          <td>Utilization</td>        </tr>   <tr data-tt-id='100' data-tt-parent-id='3'>          <td>Utilization</td>        </tr>   <tr data-tt-id='100' data-tt-parent-id='2'>          <td>Utilization</td>        </tr>   <tr data-tt-id='100' data-tt-parent-id='1'>          <td>Utilization</td>        </tr>   <tr data-tt-id='100' data-tt-parent-id='0'>          <td>Utilization</td>        </tr>      </table>";
    return treeTableStr
}

$(document).ready(function (){
    $("body").append("<div id='outer' style='padding:1%;position:relative;overflow:hidden;zoom:1;width:90%;height:90%;border:3px solid black;'></div>");
    $("#outer").append("<div id='frame' style='position:relative;width:100%;height:100%;'></div>");
    $("#frame").append("<div id='top' style='overflow:auto; zoom:1; border:1px solid black;'></div>");
    $("#top").append("<input type='button' onclick='' value='Deselect'></input>");
   
    $("#frame").append("<div id='left-t-r-top' style='height:3%;overflow:auto; zoom:1;'></div>");
    $("#frame").append("<div id='left-t-r' style='width:95%;overflow:auto; zoom:1;'></div>");

    $("#left-t-r").append("<div style='float:right'><input type='checkbox' id='uti-wei' value ='uti-max' checked>Weight</input></div>");
    $("#left-t-r").append("<div style='float:right'><input type='checkbox' id='uti-vol' value ='uti-max' checked>Volume</input></div>");
    $("#left-t-r").append("<div style='float:right'><input type='checkbox' id='uti-max' value ='uti-max' checked>Maximum</input></div>");
    $("#left-t-r").append("<div style='float:right'><input type='checkbox' name='uti' value ='utilization' onclick='showUti()' checked>Show Utilization</input></div>");
    $("#left-t-r").append("<div style='float:right'><input type='checkbox' id='uti-cap' value ='uti-cap' checked>View Capacity</input></div>");
    $("#frame").append("<div id='left-t-r-bottom' style='height:2%;overflow:auto; zoom:1;'></div>");

    $("#frame").append("<div id='left-t' style='overflow:auto; zoom:1;'></div>");
    $("#left-t").append("<select><option value='trucks'>Trucks</option></select>");

    $("#frame").append("<div id='left' style='position:absolute;border:2px solid black;overflow-y:scroll;overflow-x:scroll' onscroll='vScrollGantt(this)'><div id='tree' style='position:absolute'/></div>");
    $("#frame").append("<div id='right' style='position:absolute;border:2px solid black;overflow-x:scroll;overflow-y:hidden'  onscroll='hScrollGantt(this)'><div id='chart' style='position:absolute'/></div>");

    $("#frame").append("<div id='left-d' style='position:absolute;border:2px solid black;overflow-y:scroll;overflow-x:scroll'></div>");
    $("#frame").append("<div id='right-d' style='position:absolute;border:2px solid black;overflow-x:scroll;overflow-y:hidden'  onscroll='hScrollGantt(this)'><div id='handle' style='position:absolute'/></div>");

    $("#frame").append('<div id="spliter-h" style="position:absolute;border:3px solid #afaaa3; -webkit-user-select: none; cursor: n-resize;"></div>');
    $("#frame").append('<div id="spliter" style="position:absolute;border:3px solid #afaaa3; -webkit-user-select: none; cursor: e-resize;"></div>');

    $("#frame").append("<div id='ganttdialog' style='display:none'><table><tr><td>TaskName</td><td><input type='text' name='taskName' id='taskName'></td></tr><tr><td>Status</td><td><input type='text' name='status' id='status'></td></tr><tr><td>StartDate</td><td><input type='text' name='startDate' id='startDate'></td></tr><tr><td>EndDate</td><td><input type='text' name='endDate' id='endDate'></td></tr></table></div>");


    console.log("Draw start time:" + new Date());

    adjustPosition();
    generateTasks();

   

    oRawData.svg.svg_tree = d3.select("#tree")
    .append("svg")
    .attr("class", "tree")
    .attr("width", oRawData.layout.treewidth)
    .attr("height", oRawData.taskNames.length * 26 + oRawData.layout.margin.top + oRawData.layout.margin.bottom)
    .append("g")
    .attr("class", "gantt-chart-tree");

    oRawData.time.initialdomain = [d3.time.day.offset(getStartDate(oRawData), -2), d3.time.day.offset(getEndDate(oRawData), 2) ];
    oRawData.time.domain = [d3.time.day.offset(getStartDate(oRawData), -2), d3.time.day.offset(getEndDate(oRawData), 2) ];
    reDraw(true);

    console.log("Draw End time:" + new Date());
} );

function adjustPosition() {
    var hFrame = document.getElementById("frame").offsetHeight;
    var hTop = document.getElementById("top").offsetHeight;
    var hLeft_t_r = document.getElementById("left-t-r").offsetHeight;
    var hLeft_t_r_top = document.getElementById("left-t-r-top").offsetHeight;
    var hLeft_t_r_bottom = document.getElementById("left-t-r-bottom").offsetHeight;
    var hLeft_t = document.getElementById("left-t").offsetHeight;
    var wFrame = document.getElementById("frame").offsetWidth;
    var yOffset = hTop+hLeft_t_r+hLeft_t+hLeft_t_r_top+hLeft_t_r_bottom;
    var xTL = 0;
    var yTL = yOffset*100/hFrame;
    var hTL = (hFrame-yOffset)*oRawData.layout.vsplit/hFrame;
    var wTL = oRawData.layout.hsplit;
    document.getElementById("left").style.left = xTL + "%";
    document.getElementById("left").style.top = yTL + "%";
    document.getElementById("left").style.width = wTL + "%";
    document.getElementById("left").style.height = hTL + "%";


    var xVS = oRawData.layout.hsplit+oRawData.layout.hspace/2;
    var yVS = (getTopOffset())*100/hFrame;
    //var hVS = (hFrame-hTop-hLeft_t_r-hLeft_t_r_top)*100/hFrame+1;
	var hVS = (hFrame-getTopOffset())*100/hFrame;
    var wVS = 100-oRawData.layout.hsplit-oRawData.layout.hspace;

    var xHS = -0.5;
    var yHS = (yOffset*(100-oRawData.layout.vsplit))/hFrame+oRawData.layout.vsplit+oRawData.layout.vspace/2;
    var wHS = 101;

    var xTR = oRawData.layout.hsplit+oRawData.layout.hspace;
    var yTR = yOffset*100/hFrame;
    var hTR = (hFrame-yOffset)*oRawData.layout.vsplit/hFrame;
    var wTR = 100-oRawData.layout.hsplit-oRawData.layout.hspace;
    document.getElementById("right").style.left = xTR + "%";
    document.getElementById("right").style.top = yTR + "%";
    document.getElementById("right").style.width = wTR + "%";
    document.getElementById("right").style.height = hTR + "%";


    oRawData.layout.treewidth = oRawData.layout.hsplit * wFrame / 100 - 17;
    if(oRawData.layout.treewidth < oRawData.layout.treeactualwidth) {
        oRawData.layout.treewidth = oRawData.layout.treeactualwidth;
    }
    oRawData.layout.width = (100-oRawData.layout.hsplit-oRawData.layout.hspace) * wFrame / 100;
    oRawData.layout.initialwidth = (100-oRawData.layout.hsplit-oRawData.layout.hspace) * wFrame / 100;
    oRawData.layout.handlingheight = ((hFrame-yOffset)*(100-oRawData.layout.vsplit)-oRawData.layout.vspace*hFrame)/100;
}

function generateTasks() {
    var tasks = [
    ];

    oRawData.drivers = [];
    for(var i = 0; i < 100; i++) {
        oRawData.drivers["driver"+i] =
        {
            id : "driver"+i,
            name : "Driver "+i,
            desc : "It's Driver"+i,
            type : "driver",
        };
    }
    oRawData.locations = [];
    for(var i = 0; i < 100; i++) {
        oRawData.locations["location"+i] =
        {
            id : "location"+i,
            name : "Location "+i,
            desc : "It's Location"+i,
            type : "location",
        };
    }
    oRawData.units = [];
    for(var i = 0; i < 1000; i++) {
        oRawData.units["unit"+i] =
        {
            id : "unit"+i,
            name : "Unit "+i,
            desc : "It's Unit"+i,
            type : "unit",
            start : oRawData.locations["location"+Math.random()*100],
            end : oRawData.locations["location"+Math.random()*100],
            status : "unplanned",
            weight : Math.random() * 2000,
            volumn : Math.random() * 200,
        };
    }

    oRawData.resources = [];
    oRawData.taskNames = [];
    oRawData.taskStatus = [];
    oRawData.resources["Utilization"] = {
        id : "Utilization",
        name : "Utilization",
        desc : "It's Utilization",
        type : "other.utilization",
        plate : "",
        defaultdriver : "",
    };
    for(var i = 0; i < 10; i++) {
        oRawData.resources["Empty"+i] = {
            id : "Empty"+i,
            name : "",
            desc : "",
            type : "other.empty",
            plate : "",
            defaultdriver : "",
        };
    }
    oRawData.resources["Vehicle0"] = {
        id : "Vehicle0",
        name : "Vehicle 0",
        desc : "It's Vehicle0",
        type : "resource.vehicle",
        plate : "CO AC-1120",
        defaultdriver : "driver0",
        weightcapacity : 5000,
        volumncapacity : 500,
        weightinitial : 0,
        volumninitial : 0,
    };
    oRawData.taskNames.push(oRawData.resources["Vehicle0"].type + ":root." + oRawData.resources["Vehicle0"].id);
    oRawData.taskStatus.push({
        level : 0,
        expand : 0,
        type : oRawData.resources["Vehicle0"].type,
        source : oRawData.resources["Vehicle0"].id,
        parent : "root",
    });

    var x = d3.time.scale().domain([new Date("Sun Dec 01 01:36:45 EST 2012"), new Date("Sun Dec 09 22:36:45 EST 2012")])
    .range([ 0, oRawData.layout.initialwidth ]).clamp(false);
    for (var i = 1; i <= 50; i++) {
        oRawData.resources["Train"+i] = {
            id : "Train"+i,
            name : "Train "+i,
            desc : "It's Train"+i,
            type : "resource.train",
            plate : "CO AC-112"+i,
            defaultdriver : "driver"+i,
            weightcapacity : Math.random() * 5000 + 5000,
            volumncapacity : Math.random() * 500 + 500,
            weightinitial : 0,
            volumninitial : 0,
        };
        oRawData.taskStatus.push({
            level : 0,
            expand : 0,
            type : oRawData.resources["Train"+i].type,
            source : oRawData.resources["Train"+i].id,
            parent : "root",
            tasks : [], // TODO, here put the tasks belongs to the taskStatus or taskNames
        });
        var tnId = oRawData.resources["Train"+i].type + ":root." + oRawData.resources["Train"+i].id;
        oRawData.taskNames.push(tnId);
        var start = Math.random() * 100;
        var end = start+30;
        var package = {weight:0, volumn:0, units:[],};
        for(var j = 0; j < 7; j++) {
            var uid = "unit" + Math.floor(Math.random()*1000);
            while(oRawData.units[uid].status != "unplanned") {
                uid = "unit" + Math.floor(Math.random()*1000);
            }
            package.units.push(uid);
            package.weight += oRawData.units[uid].weight;
            package.volumn += oRawData.units[uid].volumn;
            oRawData.units[uid].status = "planned";
        }
        var packageAtStart = {weight:0,volumn:0};
        var packageAtEnd = {weight:package.weight,volumn:package.volumn};
        tasks.push({"startDate":x.invert(start),"endDate":x.invert(end),"taskName":tnId,"status":"LOAD",
            "startWeight":0,"endWeight":package.weight/oRawData.resources["Train"+i].weightcapacity,
            "startVolumn":0,"endVolumn":package.volumn/oRawData.resources["Train"+i].volumncapacity,
        "package":[],"load":package.units.concat(),"unload":[]});
        while(package.units.length > 0) {
            start = end;
            end = end + Math.random() * 200;
            packageAtStart = {weight:packageAtEnd.weight,volumn:packageAtEnd.volumn};
            packageAtEnd = {weight:packageAtStart.weight,volumn:packageAtStart.volumn};
            tasks.push({"startDate":x.invert(start),"endDate":x.invert(end),"taskName":tnId,"status":"TRAVEL",
                "startWeight":packageAtStart.weight/oRawData.resources["Train"+i].weightcapacity,
                "endWeight":packageAtEnd.weight/oRawData.resources["Train"+i].weightcapacity,
                "startVolumn":packageAtStart.volumn/oRawData.resources["Train"+i].volumncapacity,
                "endVolumn":packageAtEnd.volumn/oRawData.resources["Train"+i].volumncapacity,
            "package":package.units.concat(),"load":[],"unload":[]});
            start = end;
            end = end + 30;
            packageAtStart = {weight:packageAtEnd.weight,volumn:packageAtEnd.volumn};
            package.weight -= oRawData.units[package.units[0]].weight;
            package.volumn -= oRawData.units[package.units[0]].volumn;
            var unload = package.units.splice(0, 1);
            packageAtEnd = {weight:package.weight,volumn:package.volumn};
            tasks.push({"startDate":x.invert(start),"endDate":x.invert(end),"taskName":tnId,"status":"UNLOAD",
                "startWeight":packageAtStart.weight/oRawData.resources["Train"+i].weightcapacity,
                "endWeight":packageAtEnd.weight/oRawData.resources["Train"+i].weightcapacity,
                "startVolumn":packageAtStart.volumn/oRawData.resources["Train"+i].volumncapacity,
                "endVolumn":packageAtEnd.volumn/oRawData.resources["Train"+i].volumncapacity,
            "package":package.units.concat(),"load":[],"unload":unload});
            if(Math.random() >= 0.95) {
                start = end;
                end = end + 30;
                var packageBefore = package.units.concat();
                packageAtStart = {weight:packageAtEnd.weight,volumn:packageAtEnd.volumn};
                var uid = "unit" + Math.floor(Math.random()*1000);
                while(oRawData.units[uid].status != "unplanned") {
                    uid = "unit" + Math.floor(Math.random()*1000);
                }
                package.units.push(uid);
                package.weight += oRawData.units[uid].weight;
                package.volumn += oRawData.units[uid].volumn;
                oRawData.units[uid].status = "planned";
                packageAtEnd = {weight:package.weight,volumn:package.volumn};
                tasks.push({"startDate":x.invert(start),"endDate":x.invert(end),"taskName":tnId,"status":"LOAD",
                    "startWeight":packageAtStart.weight/oRawData.resources["Train"+i].weightcapacity,
                    "endWeight":packageAtEnd.weight/oRawData.resources["Train"+i].weightcapacity,
                    "startVolumn":packageAtStart.volumn/oRawData.resources["Train"+i].volumncapacity,
                    "endVolumn":packageAtEnd.volumn/oRawData.resources["Train"+i].volumncapacity,
                "package":packageBefore,"load":[uid],"unload":[]});
            }
        }
    };


    oRawData.tasks = [];
    for(var i = 0; i < tasks.length; i++) {
        var task = {};
        task.startDate = tasks[i].startDate;
        task.endDate = tasks[i].endDate;
        task.id = task.name = task.desc = "phase"+i;
        task.taskName = tasks[i].taskName;
        task.status = tasks[i].status;
        task.type = "task.travel";
        task.driver = "driver1";
        task.startWeight = tasks[i].startWeight;
        task.endWeight = tasks[i].endWeight;
        task.startVolumn = tasks[i].startVolumn;
        task.endVolumn = tasks[i].endVolumn;
        task.package = tasks[i].package;
        task.load = tasks[i].load;
        task.unload = tasks[i].unload;
        //console.log("startWeight:"+task.startWeight+",endWeight:"+task.endWeight+",startVolumn:"+task.startVolumn+",endVolumn:"+task.endVolumn);
        oRawData.tasks.push(task);
    }
}

function insertUtilization(pos) {
    var curParent = oRawData.taskStatus[pos-1].parent+"."+oRawData.taskStatus[pos-1].source;
    oRawData.taskStatus.splice(pos, 0, {
        level : 1,
        expand : 0,
        type : "other.utilization",
        source : "Utilization",
        parent : curParent,
    });
    oRawData.taskNames.splice(pos, 0, "other.utilization:"+curParent+"."+"Utilization");
    for(var i = 1; i < oRawData.layout.utilizationbandcount; i++) {
        oRawData.taskStatus.splice(pos+i, 0, {
            level : 1,
            expand : 0,
            type : "other.empty",
            source : "Empty"+i,
            parent : curParent,
        });
        oRawData.taskNames.splice(pos+i, 0, "other.empty:"+curParent+"."+"Empty"+i);
    }
}

function changeH(value) {
    document.getElementById("outer").style.height = value+"%";
    adjustPosition();
    reDraw(true);
}
function changeW(value) {
    document.getElementById("outer").style.width = value+"%";
    adjustPosition();
    reDraw(true);
}

function vScrollGantt (div) {
    oRawData.layout.voffset = div.scrollTop;
    document.getElementById("chart").style.top= -oRawData.layout.voffset+"px";
}

function hScrollGantt (div) {
    if(div.scrollWidth <= div.clientWidth) {
        return;
    }
    oRawData.layout.hoffset = div.scrollLeft / (div.scrollWidth - div.clientWidth);
    updateScroll(document.getElementById("right-d"));
}

function updateTimeDomain() {
    var zoomWidth = oRawData.layout.initialwidth * oRawData.layout.zoomrate;
    var x = d3.time.scale().domain(oRawData.time.initialdomain).range([ 0, zoomWidth ]).clamp(false);
    var extend = (oRawData.layout.initialwidth - zoomWidth) / 2;
    oRawData.time.domain = [x.invert(-extend), x.invert(zoomWidth + extend)];
}

function updatePosition() {
    oRawData.layout.offsetpos = parseInt(oRawData.layout.initialwidth/2
    -(oRawData.layout.initialwidth*oRawData.layout.zoomrate*0.5));
    d3.select("#chart").style("left", oRawData.layout.offsetpos+"px");
}

function updateScroll(div) {
    div.scrollLeft = oRawData.layout.hoffset * (div.scrollWidth - div.clientWidth);
}

function miniSlider() {
    $('#sliderBar').val(100);
    showValue(100);
}

function zoomIn()  {
    var num = $('#sliderBar').attr('value');
    num = num - 5;
    if(num<0){
        num = 0;
    }
    $('#sliderBar').val(num);
    showValue(num);
}

function zoomOut() {
    var num = $('#sliderBar').attr('value');

    num = parseInt(num) + 5;
    console.log('num is -------' + num);
    if (num>100) {
        num=100;
    }
    $('#sliderBar').val(num);
    showValue(num);
}

function reDraw(updateAll) {
    oRawData.layout.height = oRawData.taskNames.length * 26;
    d3.select("#tree").select(".tree")
    .attr("width", oRawData.layout.treewidth)
    .attr("height", oRawData.layout.height + oRawData.layout.margin.top + oRawData.layout.margin.bottom)

    d3.select("#chart").selectAll("svg").remove();
    gantt = d3.gantt().rawData(oRawData);
    gantt.timeDomain(oRawData.time.domain);
    gantt();

    if(updateAll == true) {
        gantt.resourceListInit();
        gantt.resourceListTitle();
    }
    gantt.resourceList();


	   var tStatus = rawData.taskStatus;
    for (var i in tStatus) {
        if(tStatus[i].expand) {
            var utasks = rawData.utasks;
            for(var j in utasks) {
                if (rawData.taskNames[i] == utasks[j].taskName) {
                    var uti = rawData.scale.y(utasks[j].y);
                    drawBarChart(utasks[j].taskName,uti,utasks[j].height);
                    break;
                }
            }
        }
    }
}

function showValue(num){
    console.log(num);

    if(num <= 0 ) num = 1;

    var rate = 1;
    if(num >= 50) {
        rate = (num - 50) / 10 + 1;
    }
    else {
        rate = 1 - ((50 - num) / 50);
    }

    oRawData.layout.zoomrate = rate;

    if (rate < 1) {
        oRawData.layout.width = oRawData.layout.initialwidth;
        updateTimeDomain();
    }
    else {
        oRawData.layout.width = oRawData.layout.initialwidth * rate;
    }

    reDraw(false);

    if (rate < 1) {
        //updatePosition();
    }
    else {
        updateScroll(document.getElementById("right"));
        updateScroll(document.getElementById("right-d"));
    }
}

function removeBarChart(bcId) {
    //$('#bcId').remove();
}

function getTopOffset() {
	var hTop = document.getElementById("top").offsetHeight;
	var hLeft_t_r = document.getElementById("left-t-r").offsetHeight;
	var hLeft_t_r_top = document.getElementById("left-t-r-top").offsetHeight;
	var hLeft_t_r_bottom = document.getElementById("left-t-r-bottom").offsetHeight;
	var hLeft_t = document.getElementById("left-t").offsetHeight;
	var yOffset = hTop+hLeft_t_r+hLeft_t+hLeft_t_r_top+hLeft_t_r_bottom;
	return yOffset;
}
function drawBarChart(taskName,yUtilization,heightUtilization) {

console.log("taskName =========================== " + taskName);
console.log("yUtilization =========================== " + yUtilization);
console.log("heightUtilization =========================== " + heightUtilization);
    function seq(start, finish, by) {
        by = by || 1;
        var out = [], i = 0,
        s = +start, f = +finish;
        for(i=s; i<=f; i=i+by) out.push(i);
        return out;
    }

    function runif(N, min, max) {
        var out = [];
        for(i in seq(1, N)) out.push(Math.floor(Math.random() * max) + min);
        return out;
    }

    function paste(string1, array) {
        var arrLen = array.length, out = [];
        for(i=0; i<arrLen; i++) { var newStr = string1 + array[i]; out.push(newStr) }
        return out;
    }

    function randomMatrix(nrow, ncol) {
        var m = []
        for(i in seq(1, nrow)) m.push(runif(ncol, 1, 50))
        return m
    }

    function remapData(data) {
        var remapped = seq(1,data[0].length).map(function(dat,i){
            return data.map(function(d,ii){
                return {x: ii, y: d[i] };
            })
        })
        return remapped;
    }

    //-------------------------------------------------------
    //                      Settings
    //-------------------------------------------------------
    var appendTo = "#chart", // Select elemet to append the chart
    //colors = ["#827f77", "#96938e", "#afaaa3"], // Colors for stacks
    //colors = ["#dddddd", "#F9A525", "#3C81E4"], // Colors for stacks
    colors = ["#999999","#cc0c00"];
    //colors = ["teal", "#f4ed7c", "#41BBB9"],

    nStack = 3, // Number of stacks
    nBars = 8 // Number of bars

    var wSVG = $("svg.chart").width(),
    hSVG = heightUtilization,
    //margin = { top: 25, right: 25, bottom: 25, left: 25 },
    margin = { top: 20, right: 0, bottom: 0, left: 0 },
    wChart = wSVG - margin.left - margin.right,
    hChart = hSVG - margin.top - margin.bottom;

    //-------------------------------------------------------
    //                      Drawing
    //-------------------------------------------------------
    var topLoc = yUtilization + 22 +'px';
    var svg = d3.select(appendTo)
    .append("div")
    .attr("id", "bc"+taskName)
    .style({
        position: "absolute",
        width: "100%	",
        top: topLoc
    })
    .append("svg:svg")
    //.attr("id", "svg-bar-chart")
    .attr("width", wSVG)
    .attr("height", hSVG)
    .append("svg:g")
    .attr("transform", "translate(" + margin.left + "," + (hSVG - margin.bottom) + ")")

    // start = oRawData.tasks.map(function(d) { return d.startDate })
    // end = oRawData.tasks.map(function(d) { return d.endDate })

    filtered = oRawData.tasks.filter(function(d) { return d.taskName === taskName })
    if (filtered == null || filtered.length ==0) {return;}
    var start = filtered.map(function(d) { return d.startDate })
    var end = filtered.map(function(d) { return d.endDate })
    var dates = d3.merge([start,end])
    var nBars = filtered.length

    var x = d3.scale.ordinal().rangeRoundBands([0, wChart])
    //var time = d3.time.scale().domain(d3.extent(dates)).range([0,500])
    var y = d3.scale.linear().range([0, hChart])
    var color = d3.scale.ordinal().range(colors)

    //var matrix = randomMatrix(nBars, nStack),
    //var matrix = [{1,2,3},{4,5,6}]
    var matrix=[];
    //var matrix = [{1,2,3},{4,5,6}]

    filtered[0].endVolumn=1.2;
    filtered[1].endVolumn=1.2;
    for (var i=0,len=filtered.length; i<len; i++)
    {

        var volumn = 100 * filtered[i].endVolumn;
        var weight = 100 * filtered[i].endWeight;
        if (volumn > weight) {
            max = volumn;
        } else {
            max = weight;
        }

        var alert=0;
        if (max>100) {
            alert=max-100;
            max=100;
        }

        matrix.push([max,alert,0]);
    }

    remapped = remapData(matrix)
    stacked = d3.layout.stack()(remapped)

    //x.domain(stacked[0].map(function(d) { return d.x }))
    //y.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y })])

    var iName = taskName.lastIndexOf(".");
    var name = taskName.substring(iName+1);
    var group = svg.selectAll("."+name)
    .data(stacked)
    .enter().append("svg:g").attr("id","maxrect")
    .attr("class", ""+name)
    .style("fill", function(d, i) { return color(i) })
    //.style("stroke", "white")

    //-------------------------------------------------------
    //                      Filtering
    //-------------------------------------------------------
    //$("input:checkbox[name='luti']").attr("id", function(i,d) { return i }) // Add ids to checkboxes
    //$("input:checkbox[name='luti']").on("click", clickBox)
    $("input:checkbox[id='uti-cap']").on("click", capClickBox)
    $("input:checkbox[id='uti-max']").on("click", maxClickBox)
    $("input:checkbox[id='uti-vol']").on("click", volClickBox)
    $("input:checkbox[id='uti-wei']").on("click", weiClickBox)

    function filterData(data, ids) {
        if(ids.length === 0) {
            var remapped = remapData(data),
            remappedCopy = JSON.parse(JSON.stringify(remapped)),
            fstacked = d3.layout.stack()(remappedCopy)
        return fstacked }
        else {
            var remapped = remapData(data),
            q = paste("i == ", ids).join("||"),
            remapped = remapped.filter(function(d,i) { return eval(q) }),
            remappedCopy = JSON.parse(JSON.stringify(remapped)),
            fstacked = d3.layout.stack()(remappedCopy)
            return fstacked
        }
    }
    var x = d3.scale.ordinal()
    .rangeRoundBands([0, wChart])
    .domain(stacked[0].map(function(d) { return d.x }))

    var hight = hChart*0.75;
    var y = d3.scale.linear()
    .range([0, hight])
    //.domain(stacked[0].map(function(d) { return d.y}))
    .domain([0, 100])
    //d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y })

    var tooltip = d3.select("body")
        .append("div")
        .attr("class","barTooltip") 
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    function redrawBar(fdata) {
        //d3.selectAll(".stacks").remove()
        svg.selectAll("."+name)
        .data(fdata)
        .selectAll(".stacks"+name)
        .data(function(d) { return d })
        .enter()
        .append("svg:rect")
        .attr("class", "stacks"+name)
        .attr("id", function(d) { return d.x })
        .attr("x", function(d,i) {
            var start = rawData.scale.x(filtered[i].startDate);
            return start;
            //return x(d.x)
        })
        .attr("y", function(d) { return (-y(d.y)-y(d.y0)) })
        .attr("height", function(d,i) {

        return (y(d.y)) })
        //.attr("width", x.rangeBand())
        .attr("width", function(d,i) {

            var end = rawData.scale.x(filtered[i].endDate);
            var start = rawData.scale.x(filtered[i].startDate);

            return (end - start+0.5);
        })
        // .attr("title", function(d) { return d.y })
        .on("mouseover", function(d){return tooltip.text(name+"::"+d.y).style("visibility", "visible");})
        .on("mousemove", function(d){return tooltip.text(name+"::"+d.y).style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(d){return tooltip.style("visibility", "hidden");})

        //if (d3.selectAll("#cappath")[0].length ==0) {
        drawCapLine(fdata);
        //}

        drawWeightLine(fdata);
        drawVolLine();

    }

    redrawBar(stacked);


    function drawVolLine() {
	    var line = d3.svg.line()
	    .x(function(d) {   

		return rawData.scale.x(d.date);
		//return rawData.scale.x(filtered[i].endDate);
		})
	   .y(function(d,i) { 
	    return  -(y(d.volumn));
	    });

		var volArray = [];
		for(var i in filtered) {
		    var volPoint={"date":"","volumn":""};
		    volPoint.date = filtered[i].startDate;
			volPoint.volumn = 100 * filtered[i].endVolumn;
		    volArray.push(volPoint);

			var volPoint2={"date":"","volumn":""};
            volPoint2.date = filtered[i].endDate;
			volPoint2.volumn = 100 * filtered[i].endVolumn;
		    volArray.push(volPoint2);
		}
	   
		svg.append("path").attr("id","volpath")
		 //.data(fdata)
		 .attr("class","volline") 
		 .attr("d", line(volArray))
         .on("mouseover", function() {
            return tooltip.text("data").style("visibility", "visible");
          })
         .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
          })
         .on("mousemove", mousemove);

          function mousemove() {
            var m = d3.mouse(this);
            return tooltip.text(m[0]+"<>"+m[1]).style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
          }
    }

    function drawWeightLine(fdata) {
	    var line = d3.svg.line()
	    .x(function(d,i) {   
		
		return rawData.scale.x(d.date);;
		})
	   .y(function(d,i) { 
	   return  -(y(d.weight));
	 });
	   
	   var volWei = [];
		for(var i in filtered) {
		    var weiPoint={"date":"","weight":""};
		    weiPoint.date = filtered[i].startDate;
			weiPoint.weight = 100 * filtered[i].endWeight;
		    volWei.push(weiPoint);
			
			var weiPoint2={"date":"","weight":""};
            weiPoint2.date = filtered[i].endDate;
			weiPoint2.weight = 100 * filtered[i].endWeight;
		    volWei.push(weiPoint2);
		}
		
		svg.append("path").attr("id","weipath")
		 //.data(fdata)
		 .attr("class","weiline") 
		 .attr("d", line(volWei));
    }


    function drawCapLine(fdata) {
        //rawData.scale.x(rawData.time.domain[1]) - rawData.scale.x(rawData.time.domain[0])
        var line = d3.svg.line().x(function(d,i) {
            if (i==0) return rawData.scale.x(rawData.time.domain[0]);
            return rawData.scale.x(rawData.time.domain[1]);
        })
        .y(function(d) { return -hight });

        svg.append("path").attr("id","cappath")
        .data(fdata)
        .attr("class","capline")
        .attr("d", line);
    }
    function capClickBox() {
        if ($('#uti-cap').is(':checked')) {
            d3.selectAll("#cappath").style("display","block")
        } else {
            d3.selectAll("#cappath").style("display","none")
        }
    }

    function maxClickBox() {
        if ($('#uti-max').is(':checked')) {
            d3.selectAll("#maxrect").style("display","block")
        } else {
            d3.selectAll("#maxrect").style("display","none")
        }
    }

    function volClickBox() {
        if ($('#uti-vol').is(':checked')) {
            d3.selectAll("#volpath").style("display","block")
        } else {
            d3.selectAll("#volpath").style("display","none")
        }
    }

    function weiClickBox() {
        if ($('#uti-wei').is(':checked')) {
            d3.selectAll("#weipath").style("display","block")
        } else {
            d3.selectAll("#weipath").style("display","none")
        }
    }


}