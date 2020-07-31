#!/usr/bin/env python
from waitress import serve

from dashboard.wsgi import application

if __name__ == '__main__':
    serve(application, threads=10, port='8000', host='127.0.0.1')
