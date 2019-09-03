from .base import BaseHandler


class CollectionHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def query_thing(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        depth = data.get('depth')

        if thing_id:
            q = r'''return(#{}, {})'''.format(thing_id, depth)
        else:
            q = r'''return(thing(.id()), {})'''.format(depth)
        print(q)
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)

    # @classmethod
    # @BaseHandler.socket_handler
    # async def return_property(cls, client, data):
    #     collection_id = data.get('collectionId')
    #     thing_id = data.get('thingId')
    #     depth = data.get('depth')
    #     propertyName = data.get('propertyName')

    #     if thing_id:
    #         q = r'''return(#{}.filter(|t| t.contains('{}')), {})'''.format(
    #             thing_id, propertyName, depth)
    #     else:
    #         q = r'''return(thing(.id()).filter(|t| t.contains('{}')), {})'''.format(
    #             propertyName, depth)
    #     resp = await client.query(q, target=collection_id)

    #     return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def remove_thing(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        name = data.get('propertyName')
        index = data.get('index')

        if (index is not None):
            q = r'''#{}.{}.splice({}, 1); #{}'''.format(
                thing_id,
                name,
                index,
                thing_id)
        else:
            q = r'''#{}.del('{}'); #{}'''.format(thing_id, name, thing_id)

        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)


    @classmethod
    @BaseHandler.socket_handler
    async def raw_query(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        query = data.get('query')
        q = r'''{}; #{}'''.format(query, thing_id)
        print(q)
        resp = await client.query(q, target=collection_id)
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def query_with_output(cls, client, data):
        collection_id = data.get('collectionId')
        query = data.get('query')
        q1 = r'''{}'''.format(query)
        output = await client.query(q1, target=collection_id)

        q2 = r'''thing(.id())'''
        things = await client.query(q2, target=collection_id)

        resp = {
            'output': output,
            'things': things,
        }

        return cls.socket_response(data=resp)
