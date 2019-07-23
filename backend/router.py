import logging
from os.path import exists, abspath
from .handlers.loginhandler import LoginHandler


def _static_factory(route, path):
    async def handle_static_file(request):
        logging.warning('Requesting static file: {}'.format(path))
        request.match_info['filename'] = path
        return await route._handle(request)

    return handle_static_file


class Router:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        static_enabled = exists(abspath('static'))
        if static_enabled:
            static = self.router.add_static('/static', 'static')
            self.router.add_route(
                'GET',
                '/favicon.ico',
                _static_factory(static, 'favicon.ico'))
        else:
            logging.warning('No static folder exists')

        # React
        self.router.add_route(
            'GET',
            '/',
            LoginHandler.index)
            