from .base import BaseHandler

class CollectionHandler(BaseHandler):

    @classmethod
    @BaseHandler.socket_handler
    async def query_thing(cls, client, data):
        collection_name = data.get('collectionName')
        thing_id = data.get('thingId')
        depth = data.get('depth')

        if thing_id:
            q = r'''return(#{}, {})'''.format(thing_id, depth)
        else:
            q = r'''return(thing(.id()), {})'''.format(depth)

        resp = await client.query(q, scope=r'''@:{}'''.format(collection_name))
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def raw_query(cls, client, data):
        collection_name = data.get('collectionName')
        thing_id = data.get('thingId')
        query = data.get('query')
        q = r'''{} #{}'''.format(query, thing_id)
        print(q)
        resp = await client.query(q, scope=r'''@:{}'''.format(collection_name))
        return cls.socket_response(data=resp)

    @classmethod
    @BaseHandler.socket_handler
    async def query_editor(cls, client, data):
        s = data.get('scope')
        query = data.get('query')

        if (s == '@thingsdb'):
            q1 = r'''{}'''.format(query)
            output = await client.query(q1, scope='@thingsdb')
            resp = {
                'output': output,
            }
        elif (s == '@node'):
            q1 = r'''{}'''.format(query)
            output = await client.query(q1, scope='@node')
            resp = {
                'output': output,
            }
        else:
            q1 = r'''{}'''.format(query)
            output = await client.query(q1, scope=s)
            q2 = r'''thing(.id())'''
            things = await client.query(q2, scope=s)
            resp = {
                'output': output,
                'things': things,
                'collectionName': s,
            }


        return cls.socket_response(data=resp)
