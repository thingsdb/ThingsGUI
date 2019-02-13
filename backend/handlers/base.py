import logging
from aiohttp import web
from ..message import Message
from ..exceptions import HandlerException
from ..thingsdb.client import Client


class BaseHandler:
    config = None
    sio = None
    clients = None

    def __init__(self):
        raise Exception('Handlers should not be initialized.')

    @classmethod
    def setup_base(cls, config, sio, clients):
        cls.config = config
        cls.sio = sio
        cls.clients = clients

        cls.sio.on(
            event='connect',
            handler=cls.connect)

        cls.sio.on(
            event='disconnect',
            handler=cls.disconnect)
        
    @classmethod
    async def connect(cls, sid, environ):
        logging.info('Socket connection: {} (Remote address: {})'.format(
            sid, environ.get('REMOTE_ADDR', 'unknown')))
        cls.clients[sid] = Client()
        return True

    @classmethod
    async def disconnect(cls, sid):
        client = cls.clients.get(sid)
        if client:
            client.close()
            cls.clients.pop(sid)
        logging.info('Socket disconnect: {}'.format(sid))

    @staticmethod
    def socket_handler(func):
        async def wrapper(cls, sid, data):
            try:
                response = await func(cls, cls.clients[sid], data)
            except HandlerException as e:
                logging.error('{}{}'.format(
                    e.log if e.log is not None else str(e),
                    ' ({})'.format(e.exc) if e.exc is not None else ''))
                response = cls.socket_response(data=None, message=Message(
                    text=str(e),
                    status=e.status,
                    log=e.log))
            except Exception as e:
                logging.exception(e)
                response = cls.socket_response(data=None, message=Message(
                    text='An error occurred in the webserver.',
                    status=500,
                    log=str(e)))

            return response

        return wrapper

    @classmethod
    def json_response(cls, data=None, message=None):
        data = {'data': data}

        if message is not None:
            data['message'] = message

        return web.json_response(
            data=data,
            status=200 if message is None else message.status)

    @classmethod
    def socket_response(cls, data=None, message=None, status=None):
        return status if status is not None else \
            0 if message is None else \
            message.status, data, message
