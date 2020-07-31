from django.http import HttpResponse
from django.shortcuts import render
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
import networkx as nx
import numpy as np
from shapely.geometry import MultiPoint, Point
import matplotlib.pyplot as plt
import io
import os
import base64
import pickle
import pandas as pd
import plotly.express as px

G_static = nx.read_graphml("data/Full_network.graphml", node_type = int , edge_key_type = int)
red_stats = np.load("data/red.npy")
green_stats = np.load("data/green.npy")
orange_stats = np.load("data/orange.npy")

df = pd.read_csv('data/data_upto_29thMay.csv')

with open('data/grid.json') as response:
    ahmd  = json.load(response)

with open("data/ward_ts.p","rb") as fp:
    ward_ts = pickle.load(fp)

# Generating the fig
fig = px.choropleth_mapbox(df, geojson=ahmd, locations='fips', color='size',
                           color_continuous_scale="Viridis",
                          # range_color=(1, 50),
                           mapbox_style="carto-positron",
                           opacity=0.5, zoom = 11, center = {"lat": 23.009985, "lon": 72.575899},
                           labels={'size':'cases by day'}, animation_frame = 'Registration Date'
                          )

graph_html = fig.to_html(full_html=False)

# Creating base 64encode
def fig_to_base64(fig):
    img = io.BytesIO()
    fig.savefig(img, format='png',
                bbox_inches='tight')
    img.seek(0)

    return base64.b64encode(img.getvalue())

# Create your views here.
def index(request):
    detection = [j[:-4] for j in os.listdir("./data/detection") if j[-3:].lower()=="png"]
    detection_testing = [j[:-4] for j in os.listdir("./data/detection_tests") if j[-3:].lower()=="png"]
    return render(request, "index.html", {'detection':detection, 'detection_testing':detection_testing, 'wardts':list(ward_ts.keys()),'wardjs':json.dumps(ward_ts) })

def base(request):
    return render(request, "base.html")

def test(request):
    return render(request, "test.html")

def team(request):
    return render(request, "team.html")

def graph(request):
    return HttpResponse(graph_html)

def rgb(minimum, maximum, value):
    minimum, maximum = float(minimum), float(maximum)
    ratio = ((value-minimum)**2 / (maximum - minimum)**2)*240
    return "hsl("+str(ratio)+", 100%, 50%)"

@csrf_exempt
def get_nodes(request):
    try:
        key = json.loads(request.body)['key']
    except:
        key='S0'
    if key=='S0':
        G_static = nx.read_graphml("data/Full_network.graphml", node_type = int , edge_key_type = int)
        keys = sorted(G_static.nodes(), key=lambda x: G_static.nodes[x]['betweeness'], reverse=True)
    if key=='S1':
        G_static = nx.read_graphml("data/network_jamalpur.graphml", node_type = int , edge_key_type = int)
        keys = sorted(G_static.nodes(), key=lambda x: G_static.nodes[x]['betweenness'], reverse=True)
    if key=='S2':
        G_static = nx.read_graphml("data/network_red.graphml", node_type = int , edge_key_type = int)
        keys = sorted(G_static.nodes(), key=lambda x: G_static.nodes[x]['betweenness'], reverse=True)
    rank = 1
    ll = len(keys)
    
    dic = {}
    for j in keys:
        gnode = G_static.nodes[j]
        node = {}
        node['latlng'] = (gnode['Y'],gnode['X'])
        node['popup'] = {
            'Rank':rank,
            'Zone':gnode['Landuse'],
        }
        node['rgb'] = rgb(1, ll, rank)
        dic[j] = node
        rank+=1
    return HttpResponse(json.dumps(dic))

@csrf_exempt
def get_edges(request):
    try:
        key = json.loads(request.body)['key']
    except:
        key='S0'
    if key=='S0':
        G_static = nx.read_graphml("data/Full_network.graphml", node_type = int , edge_key_type = int)
    if key=='S1':
        G_static = nx.read_graphml("data/network_jamalpur.graphml", node_type = int , edge_key_type = int)
    if key=='S2':
        G_static = nx.read_graphml("data/network_red.graphml", node_type = int , edge_key_type = int)
    rank = 1
    keys = sorted(G_static.edges(), key=lambda x: G_static.edges[x]['edge_weight_landuse'], reverse=True)
    ll = len(keys)

    dic = {}
    for j in keys:
        gedge = G_static.edges[j]
        edge = {}
        edge['latlngs'] = ((gedge['Y1'],gedge['X1']),(gedge['Y2'],gedge['X2']))
        edge['rgb'] = rgb(1, ll, rank)
        edge['rank'] = rank
        rank+=1
        dic[str(j)] = edge
    return HttpResponse(json.dumps(dic))

@csrf_exempt
def get_plot(request):
    params = json.loads(request.body)
    polygon = set()
    for point in params['polygon'][0]:
        polygon.add((point['lat'], point['lng']))
    poly = MultiPoint(list(polygon)).convex_hull
    population = 0
    for j in G_static:
        point = Point(G_static.nodes[j]['Y'], G_static.nodes[j]['X'])
        if point.within(poly):
            population+=G_static.nodes[j]['NP']
    fig = plt.figure()
    ax = fig.add_subplot(111)
    if params['num']==1:
        ax.plot(red_stats[0], red_stats[1]*population)
    if params['num']==2:
        ax.plot(orange_stats[0], orange_stats[1]*population)
    if params['num']==3:
        ax.plot(green_stats[0], green_stats[1]*population)
    fig.set_size_inches(float(params['width'])/fig.dpi, float(params['height'])/fig.dpi)
    encoded = fig_to_base64(fig).decode('utf-8')
    return HttpResponse(json.dumps(encoded))

@csrf_exempt
def get_image(request):
    name, directory = json.loads(request.body)
    with open(os.path.join("data",directory,name), "rb") as fp:
        b64 = base64.b64encode(fp.read())
    encoded = b64.decode('utf-8')
    return HttpResponse(json.dumps(encoded))