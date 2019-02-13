from .base import BaseHandler


class UserHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def new_user(cls, client, data):
        q = r'''new_user('{name}', '{password}');'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)
    
    @classmethod
    @BaseHandler.socket_handler
    async def del_user(cls, client, data):
        q = r'''del_user('{name}');'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def rename_user(cls, client, data):
        q = r'''rename_user('{user}', '{name}');'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def set_password(cls, client, data):
        q = r'''set_password('{user}', '{password}');'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def grant(cls, client, data):
        q = r'''grant('{collection}', '{user}', {access});'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def revoke(cls, client, data):
        q = r'''revoke('{collection}', '{user}', {access});'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)