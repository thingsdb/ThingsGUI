import datetime
from .base import BaseHandler


class UserHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def get_users(cls, client, data):
        resp = await client.users_info()
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def get_user(cls, client, data):
        if data.get('name'):
            resp = await client.user_info(data.get('name'))
        else:
            resp = await client.user_info()
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def new_user(cls, client, data):
        q = r'''new_user('{name}');
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def del_user(cls, client, data):
        q = r'''del_user('{name}');
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def rename_user(cls, client, data):
        q = r'''rename_user('{oldname}', '{newname}');
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def set_password(cls, client, data):
        q = r'''set_password('{name}', '{password}');
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def reset_password(cls, client, data):
        q = r'''set_password('{name}', nil);
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def grant(cls, client, data):
        q = r'''grant('{collection}', '{name}', ({access}));
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def revoke(cls, client, data):
        q = r'''revoke('{collection}', '{name}', ({access}));
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def new_token(cls, client, data):
        name = data.get('name')

        if data.get('expirationTime'):
            expiration_time = data.get('expirationTime')
        else:
            expiration_time = 'nil'

        if data.get('description'):
            description = data.get('description')
        else:
            description = ''
        q = r'''new_token('{}', {}, '{}');
            users_info();'''.format(name, expiration_time, description)

        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def del_token(cls, client, data):
        q = r'''del_token('{key}');
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def del_expired(cls, client, data):
        q = r'''del_expired();
            users_info();'''.format_map(data)
        result = await client.query(q, scope='@thingsdb')
        return cls.socket_response(data=result)
