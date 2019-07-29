import json
import os

from aiohttp import web

ROOT_PATH = os.path.dirname(os.path.dirname(__file__))
TEMPLATE_PATH = os.path.join(ROOT_PATH, 'templates')

if not os.path.exists(TEMPLATE_PATH):
    raise IOError('Template path missing: {}'.format(TEMPLATE_PATH))


def json_error(message):
    return web.Response(
        body=json.dumps({'error': message}).encode('utf-8'),
        content_type='application/json')


async def error_middleware(app, handler):
    async def middleware_handler(request):
        try:
            response = await handler(request)
            if response.status == 404:
                return json_error(response.message)
            return response
        except web.HTTPException as ex:
            if ex.status == 404:
                return json_error(ex.reason)
            raise

    return middleware_handler
