#!/usr/bin/env python
from waitress import serve

from dashboard.wsgi import application

if __name__ == '__main__':
    try:
        serve(application, threads=5, port='8800', host='127.0.0.1')
    except:
        serve(application, threads=5, port='8801', host='127.0.0.1')
