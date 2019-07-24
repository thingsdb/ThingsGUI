from thingsdb.exceptions import ThingsDBError
from trender.aiohttp_template import template
from .base import BaseHandler
from ..version import __version__


class LoginHandler(BaseHandler):
    @classmethod
    @template('app.html')
    async def index(cls, request):
        return {
            'version': __version__
        }

    @classmethod
    @BaseHandler.socket_handler
    async def connected(cls, client, data):
        if client.is_connected():
            resp = {
                'loaded': True,
                'connected': True,
            }        
        else:
            resp = {
                'loaded': True,
                'connected': False,
            }
        return cls.socket_response(data=resp)

    @classmethod
    async def _connect(cls, client, address, user, password):
        try:
            host, port = address.split(':', 1)
            port = int(port)
        except:
            return {
                'connected': False,
                'connErr': 'invalid address',
            }

        try:
            await client.connect(host, port)
        except OSError as e:
            return {
                'connected': False,
                'connErr': 'connection error: {}'.format(str(e)),
            }

        try:
            await client.authenticate(auth=[user, password])
        except ThingsDBError as e:
            print('authentication error \n')
            return {
                'connected': False,
                'connErr': 'auth error: {}'.format(str(e)),
            }

        resp = {
            'connected': True,
            'connErr': '',
        }
        return resp

    @classmethod
    @BaseHandler.socket_handler
    async def connect(cls, client, data):
        print(data)
        resp = await cls._connect(
            client,
            data['host'],
            data['user'],
            data['password'])
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def connect_other(cls, client, data):
        user = client._username
        password = client._password

        client.close()
        await client.wait_closed()

        resp = await cls._connect(client, data['host'], user, password)
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def disconnect(cls, client, data):
        client.close()
        await client.wait_closed()

        resp = {
            'connected': False,
            'connErr': '',
        }
        return cls.socket_response(data=resp)
