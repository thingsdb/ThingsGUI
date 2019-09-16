from thingsdb.client import Client
from thingsdb.exceptions import ThingsDBError
from .base import BaseHandler


class NodeHandler(BaseHandler):

    @staticmethod
    async def _other_node(client, other_node, q):

        host = other_node['hostname']
        port = other_node['client_port']
        client_ = Client()
        await client_.connect(host, port)
        await client_.authenticate(auth=[client._username, client._password])
        result = await client_.query(q, scope='@thingsdb')
        client_.close()
        return result

    @classmethod
    @BaseHandler.socket_handler
    async def get_nodes(cls, client, data):
        result = await client.nodes_info()
        resp = {
            'nodes': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def get_node(cls, client, data):
        q = r'''[counters(), node_info()]'''

        # TODOK connectie andere node (cls._other_node)
        result = await client.query(q, scope='@node')
        resp = {
            'counters': result[0],
            'node': result[1],
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def reset_counters(cls, client, data):
        q = r'''reset_counters(); counters();'''

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, scope='@node')

        resp = {
            'counters': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def set_loglevel(cls, client, data):
        q = r'''set_log_level({level}); node_info();'''.format_map(data)

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, scope='@node')

        resp = {
            'node': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def shutdown(cls, client, data):
        q = r'''shutdown(); node_info();'''

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, scope='@node')
            print('close in shurdown')
            client.close()

        resp = {
            'node': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def new_node(cls, client, data):  # TODOS check ipaddress?
        if data.get('port'):
            q = r'''new_node('{secret}', '{ipAddress}', {port});
                '''.format_map(data)
        else:
            q = r'''new_node('{secret}', '{ipAddress}');'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')

        resp = {
            'nodes': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def pop_node(cls, client, data):  # TODOS check query
        q = r'''pop_node();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')

        resp = {
            'nodes': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def replace_node(cls, client, data):  # TODOS check ipaddress?
        if data.get('port'):
            q = r'''replace_node({nodeId}, '{secret}', '{address}', {port});
                '''.format_map(data)
            print(q)
        else:
            q = r'''replace_node({nodeId}, '{secret}', '{address}');
                '''.format_map(data)
            print(q)
        result = await client.query(q, scope='@thingsdb')

        resp = {
            'nodes': result,
        }
        return cls.socket_response(data=resp)
