"""dashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from django.core import serializers
from django.http import HttpResponse
import map
import login
import json

def get_wards(request):
    wards = map.models.Ward.objects.all()
    data = {}
    for ward in wards:
        if ward.color =='green':
            color='#00ff00'
        elif ward.color == 'red':
            color='#ff0000'
        elif ward.color=='orange':
            color='#ff9900'
        if ward.patients == -1:
            patients = 'NA'
        else:
            patients = ward.patients
        popup = {}
        popup['Name'] = ward.name
        popup['Patients'] = patients
        popup['Social Risk'] = ward.risk
        data[ward.name] = {
            'polygon':json.loads(ward.polygon),
            'color':color,
            'popup':popup,
        }
    return HttpResponse(json.dumps(data))

def get_hospitals(request):
    wards = map.models.CovidHospital.objects.all()
    data = {}
    for ward in wards:
        data[ward.name] = [float(ward.lat), float(ward.lng)]
    return HttpResponse(json.dumps(data))

def get_testcenters(request):
    wards = map.models.TestCenter.objects.all()
    data = {}
    for ward in wards:
        data[ward.name] = [float(ward.lat), float(ward.lng)]
    return HttpResponse(json.dumps(data))

def change_ward_color(request):
    params = json.loads(request.body)
    ward = map.models.Ward.objects.get(name=params['name'])
    ward.color = params['color']
    ward.save()
    if ward.color =='green':
        color='#00ff00'
    elif ward.color == 'red':
        color='#ff0000'
    elif ward.color=='orange':
        color='#ff9900'
    return HttpResponse(json.dumps({'name':ward.name, 'color':color}))
    

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', map.views.index),
    path('test/', map.views.test),
    path('base/', map.views.base),
    path('team/', map.views.team),
    path('login/', login.views.login),
    path('change/', login.views.change),
    path('manage/', login.views.manage),
    path('get_nodes/', map.views.get_nodes),
    path('get_edges/', map.views.get_edges),
    path('get_plot/', map.views.get_plot),
    path('get_wards/', get_wards),
    path('get_hospitals/', get_hospitals),
    path('get_testcenters/', get_testcenters),
    path('req_ward_change/', change_ward_color),    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
