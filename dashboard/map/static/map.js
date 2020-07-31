var map = L.map('mapid').setView([23.0225, 72.574], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(map);

// Initialise the FeatureGroup to store editable layers
polyLayers = new L.featureGroup();
map.addLayer(polyLayers);


// Markers icon
var nodeicon = L.divIcon(
    {
        className:'node',
        html:'<span class="dot" style="background-color:rgb(255,0,0);"></span>',
        iconSize:[7,7],
    })





// Initialise Layer for Nodes
var nodeLayer = L.layerGroup().addTo(map);


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
        color: '#f03'
      }
    },
    //disable toolbar item by setting it to false
    polyline: false,                                                                                                             circle: false, // Turns off this drawing tool
    rectangle: false,
    marker: false,
    },
  edit: {
    featureGroup: polyLayers, //REQUIRED!!
    remove: false,
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

function removePoly(poly) {
    polyLayers.removeLayer(poly);
}

// var array = [];
map.on('draw:created', function (e) {

    var type = e.layerType,
        layer = e.layer;
    layer.bindPopup('<button onclick="removePoly('+L.stamp(layer)+')">Remove</button>');
    polyLayers.addLayer(layer);
});

function httpReqPost(url, data, func){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function (response) {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        func(json);
    }
  };
  xhr.send(data);
}

function LoadNodes(node_list){
  node_list.forEach(function (value) {
    L.marker(value, {icon:nodeicon}).addTo(map);
  });
}


function togglePolyLayer(cb){
    if(cb.checked == true){
        polyLayers.addTo(map);
    } else {
        map.removeLayer(cb.value);
    }
}

httpReqPost('/get_nodes/', {}, LoadNodes);
