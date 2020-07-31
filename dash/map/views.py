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
import base64

G_static = nx.read_graphml("data/Full_network.graphml", node_type = int , edge_key_type = int)
red_stats = np.load("data/red.npy")
green_stats = np.load("data/green.npy")
orange_stats = np.load("data/orange.npy")

# Creating base 64encode
def fig_to_base64(fig):
    img = io.BytesIO()
    fig.savefig(img, format='png',
                bbox_inches='tight')
    img.seek(0)

    return base64.b64encode(img.getvalue())

# Create your views here.
def index(request):
    return render(request, "index.html")

def base(request):
    return render(request, "base.html")

def test(request):
    return render(request, "test.html")

def team(request):
    return render(request, "team.html")


def rgb(minimum, maximum, value):
    minimum, maximum = float(minimum), float(maximum)
    ratio = ((value-minimum)**2 / (maximum - minimum)**2)*240
    return "hsl("+str(ratio)+", 100%, 50%)"

@csrf_exempt
def get_nodes(request):
    G_static = nx.read_graphml("data/Full_network.graphml", node_type = int , edge_key_type = int)
    bmin = 1
    bmax = len(G_static)
    
    dic = {}
    for j in G_static.nodes:
        gnode = G_static.nodes[j]
        node = {}
        node['latlng'] = (gnode['Y'],gnode['X'])
        node['popup'] = {
            'Rank':gnode['BC_Rank'],
            'Zone':gnode['Landuse'],
        }
        node['rgb'] = rgb(bmin, bmax, gnode['BC_Rank'])
        dic[j] = node
    return HttpResponse(json.dumps(dic))

@csrf_exempt
def get_edges(request):
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