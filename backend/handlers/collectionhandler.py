from .base import BaseHandler


class CollectionHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def query_thing(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        depth = data.get('depth')

        if thing_id:
            q = r'''return(t({}), {})'''.format(thing_id, depth)
        else:
            q = r'''return(t(.id()), {})'''.format(depth)
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def return_property(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        depth = data.get('depth')
        propertyName = data.get('propertyName')

        if thing_id:
            q = r'''return(t({}).filter(|thing| thing.contains('{}')), {})'''.format(
                thing_id, propertyName, depth)
        else:
            q = r'''return(t(.id()).filter(|thing| thing.contains('{}')), {})'''.format(
                propertyName, depth)
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def remove_thing(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        name = data.get('propertyName')
        index = data.get('index')

        if (index is not None):
            q = r'''t({}).{}.splice({}, 1); t({})'''.format(
                thing_id,
                name,
                index,
                thing_id)
        else:
            q = r'''t({}).del('{}'); t({})'''.format(thing_id, name, thing_id)
        
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)


    @classmethod
    @BaseHandler.socket_handler
    async def raw_query(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        query = data.get('query')
        q = r'''{}; t({})'''.format(query, thing_id)
        resp = await client.query(q, target=collection_id)
        return cls.socket_response(data=resp)

