// Init wards
async function init_wards(dict){
    for (var key in dict){
        var layer = L.polygon(dict[key]['polygon'], {color: dict[key]['color'], fillOpacity: 0.3, opacity:0.5})
        wardMapping[key] = L.stamp(layer);
        var html = '<div>'+popupGenerate(dict[key]['popup'])+'</div>';
        html+='<div ward="'+key+'">';
        html+=`<button style="background-color:#ff0000" onclick="ward_color_req(this)" id="red">&nbsp</button>
        <button style="background-color:#ff9900" onclick="ward_color_req(this)" id="orange">&nbsp</button>
        <button style="background-color:#00ff00" onclick="ward_color_req(this)" id="green">&nbsp</button>
        </div>`;
        layer.bindPopup(html);
        wardLayers.addLayer(layer);
    }
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
    
    httpReqGet("https://cors-anywhere.herokuapp.com/https://api.covid19india.org/state_district_wise.json");
//     httpReq('/get_hospitals/', init_hospitals);
//     httpReq('/get_testcenters/', init_testcenters);
    httpReq('/get_wards/', init_wards);
    // Plot data init
    httpReq('https://cors-anywhere.herokuapp.com/https://api.covid19india.org/states_daily.json', getCovidData);
// 	httpReqPost('/get_nodes/', {}, init_nodes);
//         httpReqPost('/get_edges/', {}, init_edges);
// 	init_control(map);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(map);

	return map;
}
