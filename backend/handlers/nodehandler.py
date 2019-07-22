from thingsdb.client import Client
from thingsdb.exceptions import ThingsDBError
from thingsdb import scope
from .base import BaseHandler


class NodeHandler(BaseHandler):

    @staticmethod
    async def _other_node(client, other_node, q):
        host = other_node['hostname']
        port = other_node['client_port']
        client_ = Client()
        await client_.connect(host, port)
        await client_.authenticate(client._username, client._password)
        result = await client_.query(q)
        client_.close()
        return result

    @classmethod
    @BaseHandler.socket_handler
    async def get_node(cls, client, data):
        q = r'''counters(); node();'''

        if data.get('node'):
            other_node = {
                'hostname': data['node']['address'],
                'client_port': data['node']['port']-20,  # TODOK
            }
            result = await cls._other_node(client, other_node, q)
        else:
            counters = await client.counters()
            node = await client.node_info()

        resp = {
            'counters': counters,
            'node': node,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def reset_counters(cls, client, data):
        q = r'''reset_counters(); counters();'''

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, target=scope.node)

        resp = {
            'counters': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def set_loglevel(cls, client, data):
        q = r'''set_loglevel({level}); node();'''.format_map(data)

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, target=scope.node)

        resp = {
            'node': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def set_zone(cls, client, data):
        q = r'''set_zone({zone}); node();'''.format_map(data)

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, target=scope.node)

        resp = {
            'node': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def shutdown(cls, client, data):
        q = r'''shutdown(); node();'''

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, target=scope.node)
            client.close()

        resp = {
            'node': result,
        }
        return cls.socket_response(data=resp)