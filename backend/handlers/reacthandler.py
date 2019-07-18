from thingsdb.client import Client
from thingsdb.exceptions import ThingsDBError
from thingsdb import scope
from trender.aiohttp_template import template
from .base import BaseHandler
from ..version import __version__


class ReactHandler(BaseHandler):
    @classmethod
    @template('app.html')
    async def index(cls, request):
        return {
            'version': __version__
        }

    @staticmethod
    async def on_connected(client):
        collections = await client.collections_info()
        users = await client.users_info()
        nodes = await client.nodes_info()
        # node = await client.node_info()
        # counters = await client.counters()

        return {
            'collections': collections,
            'users': users,
            'nodes': nodes,
            # 'node': node,
            # 'counters': counters,
        }

    @classmethod
    @BaseHandler.socket_handler
    async def connected(cls, client, data):
        if client.is_connected():
            resp = {
                'loaded': True,
                'connected': True,
            }
            resp.update(await cls.on_connected(client))
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
            return {
                'connected': False,
                'connErr': 'auth error: {}'.format(str(e)),
            }

        resp = {
            'connected': True,
            'connErr': '',
        }
        resp.update(await cls.on_connected(client))
        return resp

    @classmethod
    @BaseHandler.socket_handler
    async def connect(cls, client, data):
        resp = await cls._connect(client, data['host'], data['user'],
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

    @classmethod
    @BaseHandler.socket_handler
    async def query(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')

        if thing_id:
            q = r'''t({});'''.format(thing_id)
        else:
            q = r'''t(id());'''
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)
