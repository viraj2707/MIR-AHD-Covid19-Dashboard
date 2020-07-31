// All helper functions for update and init

// POST request handle
// It will do post request and then pass received data to given function
async function httpReqPost(url, data, func){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function (response) {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        func(json);
    }
  };
  xhr.send(JSON.stringify(data));
}

async function httpReq(url, func){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function (response) {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        func(json);
    }
  };
  xhr.send();
}


// Popup html generator
// It will generate a table from a dictionary
function popupGenerate(dict){
    var html='<table class="w3-table w3-bordered">'
	for (var key in dict){
		html+='<tr><td>';
		html+=key;
		html+='</td><td>';
		html+=dict[key];
		html+='</td></tr>'
	}
	html+='</table>'
	return html
}

// Image Plotter
function plotImage(source){
    var plotdiv = document.getElementById("plot-div");
    plotdiv.innerHTML = '<img src="data:image/png;base64, '+source+'" style="width:45vw;height:45vh">';
}

// Image generator
function genImage(num, lid){
//     var plotdiv = document.getElementById("plot-div");
//     plotdiv.style = "";
//     plotdiv.innerHTML = '<img src="" style="width:45vw;height:45vh">';
    dict = {
        'width': window.innerWidth,
        'height': window.innerHeight,
        'num': num,
        'polygon': polyLayers.getLayer(lid).getLatLngs(),
    }
    httpReqPost('/get_plot/', dict, plotImage);
}


// Popup Generator for Polygon
async function popupPoly(e){
    var popup = e.target.getPopup();
    popup.setContent(
        `<div id="plot-div" class=""><img src="" style="width:45vw;height:45vh"></div>
        <div>
            <button style="background-color:#ff0000" onclick='' id="red-button">&nbsp</button>
            <button style="background-color:#ff9900" onclick='' id="orange-button">&nbsp</button>
            <button style="background-color:#00ff00" onclick='' id="green-button">&nbsp</button>
            <button id='remove-button' onclick="">Remove</button>
        </div>`
    );
    document.getElementById("remove-button").setAttribute('onclick', "removePoly("+L.stamp(e.target)+")");
    document.getElementById("red-button").setAttribute('onclick', "genImage(1,"+L.stamp(e.target)+")");
    document.getElementById("orange-button").setAttribute('onclick', "genImage(2,"+L.stamp(e.target)+")");
    document.getElementById("green-button").setAttribute('onclick', "genImage(3,"+L.stamp(e.target)+")");
}

// async function polyClose(){
//     document.getElementById("plot-div").style = "display:none";
// }


// Node Slider
function nodeSlider() {
    var handle = $ ("#node-handler");handle.text(nodeCount);
    $( "#node-slider" ).slider({
        min: 1,
        max: nodeCount,
        step: 1,
        range: true,
        values: [1, nodeCount],
        create: function() {var handle = $ ("#node-handler");handle.text( '1 - '+nodeCount );},
        slide: function (event, ui) {
            var handle = $ ("#node-handler");
            handle.text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            var counter = ui.values[1];
            var acounter = ui.values[0];
            if (nodeLayers.hasLayer(nodeList[nodeMapping[acounter]]['layer']) && acounter>1){
                acounter--;
                while (nodeLayers.hasLayer(nodeList[nodeMapping[acounter]]['layer']) && acounter>0){
                    nodeLayers.removeLayer(nodeList[nodeMapping[acounter]]['layer']);
                    acounter--;
                }
            } else {
                while (!nodeLayers.hasLayer(nodeList[nodeMapping[acounter]]['layer']) && acounter<=ui.values[1]){
                    nodeLayers.addLayer(nodeList[nodeMapping[acounter]]['layer']);
                    acounter++;
                }
            }
            if (nodeLayers.hasLayer(nodeList[nodeMapping[counter]]['layer']) && counter < nodeCount){
                counter++;
                while (nodeLayers.hasLayer(nodeList[nodeMapping[counter]]['layer']) && counter<=nodeCount){
                    nodeLayers.removeLayer(nodeList[nodeMapping[counter]]['layer']);
                    counter++;
                }
            } else {
                while (!nodeLayers.hasLayer(nodeList[nodeMapping[counter]]['layer']) && counter > ui.values[0]){
                    nodeLayers.addLayer(nodeList[nodeMapping[counter]]['layer']);
                    counter--;
                }
            }
        }
    });
}

// Edge Slider
function edgeSlider() {
    var handle = $ ("#edge-handler");handle.text(nodeCount);
    $( "#edge-slider" ).slider({
        min: 1,
        max: edgeCount,
        step: 1,
        range: true,
        values: [1, edgeCount],
        create: function() {var handle = $ ("#edge-handler");handle.text( '1 - '+edgeCount );},
        slide: function (event, ui) {
            var handle = $ ("#edge-handler");
            handle.text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            var counter = ui.values[1];
            var acounter = ui.values[0];
            if (edgeLayers.hasLayer(edgeList[edgeMapping[acounter]]['layer']) && acounter>1){
                acounter--;
                while (edgeLayers.hasLayer(edgeList[edgeMapping[acounter]]['layer']) && acounter>0){
                    edgeLayers.removeLayer(edgeList[edgeMapping[acounter]]['layer']);
                    acounter--;
                }
            } else {
                while (!edgeLayers.hasLayer(edgeList[edgeMapping[acounter]]['layer']) && acounter<=ui.values[1]){
                    edgeLayers.addLayer(edgeList[edgeMapping[acounter]]['layer']);
                    acounter++;
                }
            }
            if (edgeLayers.hasLayer(edgeList[edgeMapping[counter]]['layer']) && counter < edgeCount){
                counter++;
                while (edgeLayers.hasLayer(edgeList[edgeMapping[counter]]['layer']) && counter<=edgeCount){
                    edgeLayers.removeLayer(edgeList[edgeMapping[counter]]['layer']);
                    counter++;
                }
            } else {
                while (!edgeLayers.hasLayer(edgeList[edgeMapping[counter]]['layer']) && counter > ui.values[0]){
                    edgeLayers.addLayer(edgeList[edgeMapping[counter]]['layer']);
                    counter--;
                }
            }
        }
    });
}

// Tab change Management
function changeTab(obj){
    if (obj.parentNode.id == "dashboard-tab"){
        currTab.style = "display:none;";
        obj.className = "active";
        document.getElementById("dashboard").style = "";
        currTab = document.getElementById('dashboard');
        currTab.style="";
    }
    if (obj.parentNode.id == "team-tab"){
        currTab.style = "display:none;";
        obj.className = "active";
        document.getElementById("team").style = "";
        currTab = document.getElementById('team');
        currTab.style="";
    }
    if (obj.parentNode.id == "model-tab"){
        currTab.style = "display:none;";
        obj.className = "active";
        document.getElementById("spread-model").style = "";
        currTab = document.getElementById('spread-model');
        currTab.style="";
   }
    if (obj.parentNode.id == "about-tab"){
        currTab.style = "display:none;";
        obj.className = "active";
        document.getElementById("about").style = "";
        currTab = document.getElementById('about');
        currTab.style="";
   }
}

function httpReqGet(url){
  		var xhr = new XMLHttpRequest();
  		xhr.open("GET", url, true);
  		xhr.setRequestHeader("Content-Type", "application/json");
  		xhr.onreadystatechange = function (response) {
    			if (xhr.readyState === 4 && xhr.status === 200) {
        		var json = JSON.parse(xhr.responseText);
				var state = document.getElementById("sta");
                                    state.innerHTML = '';
				    for (key in json.Gujarat.districtData) {
        				state.insertAdjacentHTML( 'beforeend','<option value ="' + key + '">' + key + '</option>');
				    }
				    var city = window.city;
                    if( city == 'Ahmadabad'){ city = 'Ahmedabad';}
                    state.value = city;
        			   var output = json.Gujarat.districtData[city]['active'];
				        var confirmed  = json.Gujarat.districtData[city]['confirmed'];
				        var deceased = json.Gujarat.districtData[city]['deceased'];
				        var recovered = json.Gujarat.districtData[city]['recovered'];
                    			document.getElementById("active").innerHTML = output;
                   			document.getElementById("confirmed").innerHTML = confirmed;
                    			document.getElementById("deceased").innerHTML = deceased;
                    			document.getElementById("recovered").innerHTML = recovered;}
			};

  			xhr.send();
        setTimeout('httpReqGet("https://cors-anywhere.herokuapp.com/https://api.covid19india.org/state_district_wise.json")', 60000);
		}

// Covid cases plot functions
function getCovidData(json){
    var data = json['states_daily'];
    var dict = {};
    var maxKey = data.length;
    var counter = maxKey-21;
    while(counter<maxKey){
        dict[data[counter]['date']] = {};
        counter++;
    }
    counter = maxKey-21;
    while(counter<maxKey){
        dict[data[counter]['date']][data[counter]['status']] = data[counter]['gj'];
        counter++;
    }
    data = [['Date', 'Confirmed', 'Recovered','Deceased']];
    for (var date in dict){
        data.push([
            date,
            parseInt(dict[date]['Confirmed']),
            parseInt(dict[date]['Recovered']),
            parseInt(dict[date]['Deceased']),]
            );
    }
    createChart(data, 'curve_chart', 'Gujarat Covid19 Cases', 'col');
}

function createChart(data, divid, title, type) {
    var chart_div = document.getElementById(divid);
    chart_div.innerHTML = '';
    var chart_data = google.visualization.arrayToDataTable(data);
    if(type=='col'){var chart = new google.visualization.ColumnChart(chart_div);}
    if(type=='line'){var chart = new google.visualization.LineChart(chart_div);}
    var options = {
        title: title,
        curveType: 'function',
        legend: { position: 'in' },
	hAxis : { 
        textStyle : {fontSize: 7},
        slantedText: true,
        slantedTextAngle: 45,
        	},
        vAxis : {minValue:0,},
    	};
    chart.draw(chart_data, options);
}

// Function for plotting Ward Data
async function setWardts(name){
    var data = []
    data.push(['Date','Cases']);
    wardts[name].forEach( function(value){
       data.push([value[0][2].toString()+'-'+value[0][1].toString()+'-'+value[0][0].toString(), value[1]]); 
    });
    createChart(data, 'ward_chart', name+' Total Covid Cases', 'line');
}


// Function to get the scenario plot
async function getImg(obj, directory){
    if (obj.value=='') return;
    httpReqPost('/get_image/',
                [obj.value+'.png', directory],
                function (img){
        var plotdiv = document.getElementById("scenario-plot");
        plotdiv.innerHTML = '<img src="data:image/png;base64, '+img+'" style="width:60%;height:60%">';
    }
               );
}
