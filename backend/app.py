import os
import signal
import functools
import logging
import socketio
from configparser import ConfigParser
from aiohttp import web
from aiohttp.web import Application
from .handlers.base import BaseHandler
from .router import Router
from .handlers import setup_templates
from .version import __version__
from .socketrouter import SocketRouter


class App(Router, Application):
    def __init__(
            self,
            port=8080,
            debug_mode=False,
            use_mocks=False,
            config_file='/etc/oshttp/oshttp.conf',
            create_local_tokens=False):
        super().__init__(middlewares=[self.error_middleware])

        if not os.path.isfile(config_file):
            raise IOError('Config file missing: {}'.format(config_file))

        self.config = ConfigParser()
        self.config.read(config_file)
        self.port = port
        self.debug_mode = debug_mode
        self.use_mocks = use_mocks

        self.clients = {}

        # we can decide to increase the buffer size here,
        # for example to: max_http_buffer_size=250*1024**2  (250MB)
        self.sio = socketio.AsyncServer(
            async_mode='aiohttp',
            ping_timeout=60,
            ping_interval=25)

        SocketRouter(self.sio)
        self.sio.attach(self)

        logger = logging.getLogger('engineio')
        if debug_mode:
            logger.setLevel(logging.DEBUG)
        else:
            logger.setLevel(logging.CRITICAL)
        logger.setLevel(logging.CRITICAL)

        BaseHandler.setup_base(self.config, self.sio, self.clients)

        if self.debug_mode:
            logger.setLevel(logging.DEBUG)

        setup_templates()

    def start(self):
        logging.info('Start server {}'.format(__version__))

        handler = self.make_handler()

        logging.info('Start listening on port {}'.format(self.port))
        try:
            srv = self.loop.run_until_complete(
                self.loop.create_server(handler, '0.0.0.0', self.port))
        except Exception as e:
            logging.error('Cannot start server: {}'.format(e))
            raise e

        # add signal handlers
        for signame in ('SIGINT', 'SIGTERM'):
            self.loop.add_signal_handler(
                getattr(signal, signame),
                functools.partial(self.stop, signame))

        try:
            self.loop.run_forever()
        except KeyboardInterrupt:
            pass
        finally:
            # cleanup signal handlers
            for signame in ('SIGINT', 'SIGTERM'):
                self.loop.remove_signal_handler(getattr(signal, signame))

            srv.close()
            self.loop.run_until_complete(srv.wait_closed())
            self.loop.run_until_complete(self.shutdown())
            self.loop.run_until_complete(self.cleanup())

            for client in self.clients.values():
                client.close()

        # from engineio v10 raises error at shutdown because
        # AsyncServer._service_task() still running

        #TODOK self.loop.close()
        logging.info('Bye!')

    def stop(self, signame):
        logging.warning(
            'Signal \'{}\' received, stop server!'.format(
                signame))

        self.loop.stop()

    @staticmethod
    async def error_middleware(app, handler):
        async def middleware_handler(request):
            try:
                return await handler(request)
            except OSError as e:
                # This exception is raised after disconnecting a socket
                # connection. We might in a future update check if this is
                # still the case. (Can be triggered by simply pressing F5)
                return web.json_response({'error': str(e)})

        return middleware_handler
