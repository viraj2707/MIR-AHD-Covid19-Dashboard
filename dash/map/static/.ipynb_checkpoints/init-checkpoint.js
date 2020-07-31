// Removing Polygons
function removePoly(poly) {
    polyLayers.removeLayer(poly);
    map.addControl(drawControl);
}

// Adding polygons to map
function addPolygon(e) {
    var type = e.layerType,
        layer = e.layer;
    var popup = L.popup({maxWidth:window.innerWidth}, layer);
    layer
        .bindPopup(popup)
        .on('popupopen', popupPoly)
//         .on('popupclose', polyClose)
    polyLayers.addLayer(layer);
    drawControl.remove()
}

// Init wards
async function init_wards(dict){
    for (var key in dict){
        var layer = L.polygon(dict[key]['polygon'], {color: dict[key]['color'], fillOpacity: 0.3, opacity:0.5})
        layer.bindPopup(popupGenerate(dict[key]['popup']));
        wardLayers.addLayer(layer);
    }
}

// Init hospitals
async function init_hospitals(dict){
    for (var key in dict){
        var layer = L.marker(dict[key], {icon:hospitalicon})
        layer.bindPopup(key);
        hospitalLayers.addLayer(layer);
    }
}

// Init testcenters
async function init_testcenters(dict){
    for (var key in dict){
        var layer = L.marker(dict[key], {icon:testicon})
        layer.bindPopup(key);
        testcenterLayers.addLayer(layer);
    }
}


// Init the nodes
async function init_nodes(dict){
	nodeLayers.clearLayers();
    nodeCount = 1;
	for (var key in dict){
            var layer = L.circle(
                dict[key]['latlng'],
                {radius: 10,stroke:false, fill:true, color:dict[key]['rgb'], fillOpacity: 0.75}
                );
        nodeList[key] = {
            'layer': layer,
            'popup': popupGenerate(dict[key]['popup']),
        };
        nodeMapping[dict[key]['popup']['Rank']] = key;
		nodeLayers.addLayer(nodeList[key]['layer']);
		layer.bindPopup(nodeList[key]['popup']);
        nodeCount++;
	}
    nodeCount--;
    nodeSlider();
}

// Init the edges
async function init_edges(dict){
    edgeLayers.clearLayers()
    edgeCount = 1;
    for (var key in dict){
        var layer = L.polyline(
            dict[key]['latlngs'],
            {weight: 2, fill:true, fillOpacity: 0.6, color: dict[key]['rgb']}
        );
        edgeList[key] = {'layer':layer};
        edgeMapping[dict[key]['rank']] = key;
        edgeLayers.addLayer(edgeList[key]['layer']);
        edgeCount++;
    }
    edgeCount--;
    edgeSlider();
    
//     document.getElementById("loader").style="display:none";
//     document.getElementById("loaded").style = "";
}


// Init polygon Drawer
function init_polyDraw(){
    var drawPluginOptions = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: 'red', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#13f'
          }
        },
        //disable toolbar item by setting it to false
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        },
    };
    
    var drawControl = new L.Control.Draw(drawPluginOptions);
    return drawControl;
}

var drawControl = init_polyDraw();

// Init the contorls on map
function init_control(map){
    var mixed = {
    	"All Intersections": nodeLayers,
    	"All Roads": edgeLayers,
        "Wards": wardLayers,
        "Covid Hospitals": hospitalLayers,
        "Covid Test Centers": testcenterLayers,
    };

    L.control.layers(null, mixed).addTo(map);
    map.addControl(drawControl);
}


// Init covid api
$(function covid_api() {
		window.city = $( "select" ).val();
		$( "select" ).change(covid_api);
		$( "select" ).change(httpReqGet("https://cors-anywhere.herokuapp.com/https://api.covid19india.org/state_district_wise.json"));})

// Init the map
function initMap(mapid){
	var map = L.map(mapid, {preferCanvas: true}).setView([23.0225, 72.574], 13);

	map.addLayer(wardLayers);
    map.addLayer(edgeLayers);
	map.addLayer(nodeLayers);
	map.addLayer(polyLayers);
    
    // District wise data
    httpReqGet("https://cors-anywhere.herokuapp.com/https://api.covid19india.org/state_district_wise.json");
    // Plot data init
    httpReq('https://cors-anywhere.herokuapp.com/https://api.covid19india.org/states_daily.json', getCovidData);
    // Init hospitals
    httpReq('/get_hospitals/', init_hospitals);
    httpReq('/get_testcenters/', init_testcenters);
    httpReq('/get_wards/', init_wards);
	httpReqPost('/get_nodes/', {}, init_nodes);
        httpReqPost('/get_edges/', {}, init_edges);
	init_control(map);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(map);

	return map;
}
