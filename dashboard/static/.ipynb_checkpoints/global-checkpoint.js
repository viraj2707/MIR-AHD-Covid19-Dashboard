// This will define the global variables
// This will not include map

// Polygon Layer - For keeping the drawn polygon
polyLayers = new L.featureGroup();

// Node Layer - For keeping the node data
nodeLayers = new L.featureGroup();

// Edge Layer -  For keeping edge data
edgeLayers = new L.featureGroup();

// Wards layer -  For keeping the ward data
wardLayers = new L.featureGroup();

// Hospital and Testing Center Layers
hospitalLayers = new L.featureGroup();
testcenterLayers = new L.featureGroup();

// Mappings - This is to maintain django ids and leaflet ids
var nodeMapping = {}
var edgeMapping = {}

// Dictionaries to store element popup and other information
var nodeList = {}
var edgeList = {}

// Total number of nodes and edges
var nodeCount = 0;
var edgeCount = 0;

// Hospital and testcenter icon
var hospitalicon = L.icon({iconUrl: '/static/images/hospital.png', iconSize: [45, 70]});
var testicon = L.icon({iconUrl: '/static/images/test.png', iconSize: [45, 70]});

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(initialize);