import json
import os

from aiohttp import web

ROOT_PATH = os.path.dirname(os.path.dirname(__file__))
TEMPLATE_PATH = os.path.join(ROOT_PATH, 'templates')

if not os.path.exists(TEMPLATE_PATH):
    raise IOError('Template path missing: {}'.format(TEMPLATE_PATH))
