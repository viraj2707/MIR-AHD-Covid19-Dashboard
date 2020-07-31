var wardMapping = {};

async function change_color_ward(dict){
    var layer = wardLayers.getLayer(wardMapping[dict['name']]);
    layer.setStyle({color: dict['color'],});
}

async function ward_color_req(obj){
    httpReqPost('/req_ward_change/', {'color':obj.id, 'name':obj.parentNode.getAttribute('ward')}, change_color_ward);
}
