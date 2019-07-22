from .base import BaseHandler


class CollectionHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def new_collection(cls, client, data):
        q = r'''new_collection('{name}');
            collections_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def del_collection(cls, client, data):
        q = r'''del_collection('{collection}');
            collections_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def rename_collection(cls, client, data):
        q = r'''rename_collection('{collection}', '{name}');
            collections_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def set_quota(cls, client, data):
        q = r'''set_quota('{collection}', '{quotaType}', {quota});
            collections_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)