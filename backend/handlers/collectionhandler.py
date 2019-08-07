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
            q = r'''t(id()) => {}'''.format(depth)
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def return_property(cls, client, data):
        print(data)
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')
        depth = data.get('depth')
        search = data.get('search')

        if thing_id:
            q = r'''t({}).filter(|thing| thing.contains('{}')) => {}'''.format(thing_id, search, depth)
        else:
            q = r'''t(id()).filter(|thing| thing.contains('{}')) => {}'''.format(search, depth)
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)
