from .base import BaseHandler


class CollectionHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def new_collection(cls, client, data):
        q = r'''new_collection('{name}');'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)
    
    @classmethod
    @BaseHandler.socket_handler
    async def del_collection(cls, client, data):
        q = r'''del_collection('{name}');'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def rename_collection(cls, client, data):
        q = r'''rename_collection('{collection}', '{name}');'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)