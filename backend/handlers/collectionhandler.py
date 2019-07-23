from .base import BaseHandler


class CollectionHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def query(cls, client, data):
        collection_id = data.get('collectionId')
        thing_id = data.get('thingId')

        if thing_id:
            q = r'''t({});'''.format(thing_id)
        else:
            q = r'''t(id());'''
        resp = await client.query(q, target=collection_id)

        return cls.socket_response(data=resp)
