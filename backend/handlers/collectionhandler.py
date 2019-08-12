from .base import BaseHandler


class CollectionHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def query_thing(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        depth = data.get('depth')

        if thing_id:
            q = r'''t({}) => {}'''.format(thing_id, depth)
        else:
            q = r'''t(.id()) => {}'''.format(depth)
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
            q = r'''t({}).filter(|thing| thing.contains('{}')) => {}'''.format(
                thing_id, propertyName, depth)
        else:
            q = r'''t(.id()).filter(|thing| thing.contains('{}')) => {}'''.format(
                propertyName, depth)
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def remove_object(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        name = data.get('propertyName')

        q = r'''t({}).del('{}'); t(.id())'''.format(thing_id, name)
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

