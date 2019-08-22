from .base import BaseHandler


class ThingsDBHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def get_dbinfo(cls, client, data):
        collections = await client.collections_info()
        users = await client.users_info()
        user = await client.user_info()

        resp = {
            'collections': collections,
            'users': users,
            'user': user,
        }

        print('19', user)
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def get_collections(cls, client, data):
        resp = await client.collections_info()
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def get_collection(cls, client, data):
        resp = await client.collection_info(data.get('name'))
        return cls.socket_response(data=resp)

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
        q = r'''del_collection('{name}');
            collections_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def rename_collection(cls, client, data):
        q = r'''rename_collection('{oldname}', '{newname}');
            collections_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)

    @classmethod
    @BaseHandler.socket_handler
    async def set_quota(cls, client, data):
        q = r'''set_quota('{name}', '{quotaType}', {quota});
            collections_info();'''.format_map(data)
        result = await client.query(q)
        return cls.socket_response(data=result)
        