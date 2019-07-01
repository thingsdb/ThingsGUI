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
    async def collections(client):
        collections = await client.collections()
        users = await client.users()
        nodes = await client.nodes()
        node = await client.node()
        counters = await client.counters()

        return {
            'collections': collections,
            'users': users,
            'nodes': nodes,
            'node': node,
            'counters': counters,
        }

    @classmethod
    @BaseHandler.socket_handler
    async def connected(cls, client, data):
        if client.is_connected():
            resp = {
                'loaded': True,
                'connected': True,
            }
            resp.update(await cls.collections(client))
        else:
            resp = {
                'loaded': True,
                'connected': False,
            }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def connect(cls, client, data):
        try:
            host, port = data['host'].split(':', 1)
        except:
            return cls.socket_response(data={
                'connected': False,
                'connErr': 'invalid address',
            })

        try:
            await client.connect(host, int(port))
        except OSError as e:
            return cls.socket_response(data={
                'connected': False,
                'connErr': 'connection error: {}'.format(str(e)),
            })

        try:
            await client.authenticate(data['user'], data['password'])
        except ThingsDBError as e:
            return cls.socket_response(data={
                'connected': False,
                'connErr': 'auth error: {}'.format(str(e)),
            })

        resp = {
            'connected': True,
            'connErr': '',
        }
        resp.update(await cls.collections(client))
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
