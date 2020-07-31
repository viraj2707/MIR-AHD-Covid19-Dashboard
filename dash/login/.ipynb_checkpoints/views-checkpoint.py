from django.shortcuts import render
import json
from django.http import HttpResponse

# Create your views here.
def login(request):
    return render(request, "login.html")

def change(request):
    return render(request, "change.html")

def manage(request):
    return render(request, "manage.html")
