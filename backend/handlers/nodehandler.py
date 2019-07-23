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
        await client_.authenticate(auth=[client._username, client._password])
        result = await client_.query(q)
        client_.close()
        return result

    @classmethod
    @BaseHandler.socket_handler
    async def get_nodes(cls, client, data):
        resp = await client.nodes_info()
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def get_node(cls, client, data):
        q = r'''[counters(), node_info()]'''

        # TODOK connectie andere node (cls._other_node)
        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, target=scope.node)
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
            result = await client.query(q, target=scope.node)

        resp = {
            'counters': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def set_loglevel(cls, client, data):
        q = r'''set_loglevel({level}); node_info();'''.format_map(data)

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
        q = r'''set_zone({zone}); node_info();'''.format_map(data)

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
        q = r'''shutdown(); node_info();'''

        if data.get('node'):
            result = await cls._other_node(client, data.get('node'), q)
        else:
            result = await client.query(q, target=scope.node)
            client.close()

        resp = {
            'node': result,
        }
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def new_node(cls, client, data):  # TODOS check ipadress?
        if data.get('port'):
            q = r'''new_node('{secret}', '{ip_adress}', {port});
                nodes_info();'''.format_map(data)
        else:
            q = r'''new_node('{secret}', '{ip_adress}');
                nodes_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)
    
    @classmethod
    @BaseHandler.socket_handler
    async def pop_node(cls, client, data):  # TODOS check query
        q = r'''pop_node();
            nodes_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def replace_node(cls, client, data):  # TODOS check ipadress?
        if data.get('port'):
            q = r'''replace_node({node_id}, '{secret}', {port});
                nodes_info();'''.format_map(data)
        else:
            q = r'''replace_node({node_id}, '{secret}');
                nodes_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)
