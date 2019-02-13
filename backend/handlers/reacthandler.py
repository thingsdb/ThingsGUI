from trender.aiohttp_template import template
from .base import BaseHandler
from ..version import __version__
from ..thingsdb.client import Client
from ..thingsdb.exceptions import ThingsDBError


class ReactHandler(BaseHandler):
    @classmethod
    @template('app.html')
    async def index(cls, request):
        return {
            'version': __version__
        }

    @staticmethod
    async def collections(client):
        result = await client.query(r'''

            /* del_collection('test2'); */
            /* node(); */
            /* nodes(); */
            /* new_node('secret', '127.0.0.1', 9221); */
            /* new_collection('test'); */

            collections();
            nodes();
            users();
            node();
        ''')
        return {
            'collections': result[0],
            'nodes': result[1],
            'users': result[2],
            'node': result[3],
        }

    @classmethod
    @BaseHandler.socket_handler
    async def connected(cls, client, data):
        if client.is_connected():
            resp = {
                'connected': True,
            }
            resp.update(await cls.collections(client))
        else:
            resp = {
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
            q = r'''thing({});'''.format(thing_id)
        else:
            q = r'''thing(id());'''
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)
