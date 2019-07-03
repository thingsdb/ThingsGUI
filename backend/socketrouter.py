from .handlers.collectionhandler import CollectionHandler
from .handlers.nodehandler import NodeHandler
from .handlers.reacthandler import ReactHandler
from .handlers.userhandler import UserHandler

# regex
# match:
# (self.router.add_route\()(\n[\s]+)('.*?',)(\n[\s]+)('.*?'),(\n[\s]+)(.*?)\)
# replace: sio.on(event =$5, handler =$7)

class SocketRouter:
    def __init__(self, sio):
        sio.on(
            event='/connected',
            handler=ReactHandler.connected)

        sio.on(
            event='/connect',
            handler=ReactHandler.connect)

        sio.on(
            event='/connect/other',
            handler=ReactHandler.connect_other)

        sio.on(
            event='/disconnect',
            handler=ReactHandler.disconnect)

        sio.on(
            event='/collection/query',
            handler=ReactHandler.query)

        sio.on(
            event='/collection/add',
            handler=CollectionHandler.new_collection)

        sio.on(
            event='/collection/remove',
            handler=CollectionHandler.del_collection)

        sio.on(
            event='/collection/rename',
            handler=CollectionHandler.rename_collection)

        sio.on(
            event='/collection/setquota',
            handler=CollectionHandler.set_quota)

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
            event='/grant',
            handler=UserHandler.grant)

        sio.on(
            event='/revoke',
            handler=UserHandler.revoke)

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
