from .handlers.collectionhandler import CollectionHandler
from .handlers.thingsdbhandler import ThingsDBHandler
from .handlers.nodehandler import NodeHandler
from .handlers.loginhandler import LoginHandler
from .handlers.userhandler import UserHandler

# regex
# match:
# (self.router.add_route\()(\n[\s]+)('.*?',)(\n[\s]+)('.*?'),(\n[\s]+)(.*?)\)
# replace: sio.on(event =$5, handler =$7)


class SocketRouter:
    def __init__(self, sio):
        sio.on(
            event='/connected',
            handler=LoginHandler.connected)

        sio.on(
            event='/connect',
            handler=LoginHandler.connect)

        sio.on(
            event='/connect/other',
            handler=LoginHandler.connect_other)

        sio.on(
            event='/disconnect',
            handler=LoginHandler.disconnect)

        sio.on(
            event='/collection/query',
            handler=CollectionHandler.query)

        sio.on(
            event='/collection/getcollections',
            handler=ThingsDBHandler.get_collections)

        sio.on(
            event='/collection/get',
            handler=ThingsDBHandler.get_collection)

        sio.on(
            event='/collection/add',
            handler=ThingsDBHandler.new_collection)

        sio.on(
            event='/collection/remove',
            handler=ThingsDBHandler.del_collection)

        sio.on(
            event='/collection/rename',
            handler=ThingsDBHandler.rename_collection)

        sio.on(
            event='/collection/setquota',
            handler=ThingsDBHandler.set_quota)

        sio.on(
            event='/user/getusers',
            handler=UserHandler.get_users)

        sio.on(
            event='/user/get',
            handler=UserHandler.get_user)

        sio.on(
            event='/user/add',
            handler=UserHandler.new_user)

        sio.on(
            event='/user/remove',
            handler=UserHandler.del_user)

        sio.on(
            event='/user/rename',
            handler=UserHandler.rename_user)

        sio.on(
            event='/user/password',
            handler=UserHandler.set_password)     

        sio.on(
            event='user/grant',
            handler=UserHandler.grant)

        sio.on(
            event='user/revoke',
            handler=UserHandler.revoke)

        sio.on(
            event='/user/newtoken',
            handler=UserHandler.new_token)

        sio.on(
            event='/user/deltoken',
            handler=UserHandler.del_token)
        
        sio.on(
            event='/user/delexpired',
            handler=UserHandler.del_expired)
        
        sio.on(
            event='/node/getnodes',
            handler=NodeHandler.get_nodes)

        sio.on(
            event='/node/get',
            handler=NodeHandler.get_node)

        sio.on(
            event='/node/loglevel',
            handler=NodeHandler.set_loglevel)

        sio.on(
            event='/node/zone',
            handler=NodeHandler.set_zone)

        sio.on(
            event='/node/counters/reset',
            handler=NodeHandler.reset_counters)

        sio.on(
            event='/node/shutdown',
            handler=NodeHandler.shutdown)

        sio.on(
            event='/node/add',
            handler=NodeHandler.new_node)

        sio.on(
            event='/node/pop',
            handler=NodeHandler.pop_node)

        sio.on(
            event='/node/replace',
            handler=NodeHandler.replace_node)
