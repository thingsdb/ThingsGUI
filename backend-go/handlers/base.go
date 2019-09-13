package handlers

import (
	"flag"
	"fmt"
	"net/http"

	things "github.com/thingsdb/ThingsDB/tree/master/connectors/go"
	socketio "github.com/transceptor-technology/go-socket.io"
)


type BaseHandler struct {
    so *socketio.Socket
    clients map[string]*things.Client
}


func init(){
    //raise Exception('Handlers should not be initialized.')
}

func (b *BaseHandler) SetupBase(so *socketio.Socket, clients map[string]*things.Client) {
    b.so = so
    b.clients = clients

    b.so.On("connect", func(_ string) (bool) {
        return connect(sid int, environ map[string][string])
    })
    b.so.On("disconnect", func(_ string) (int, interface{}) {
        return disconnect()
    })
}

func (b *BaseHandler) connect(sid int, environ map[string][string]) bool {
    log.Printf("Socket connection: %d (Remote address: %s)",
        sid, environ.get("REMOTE_ADDR", "unknown"))
    b.clients[sid] = things.Client()
    return true
}


// func disconnect(cls, sid):
//     client = cls.clients.get(sid)
//     if client:
//         client.close()
//         await client.wait_closed()
//         cls.clients.pop(sid)
//     logging.info('Socket disconnect: {}'.format(sid))

// @staticmethod
// def socket_handler(func):
//     async def wrapper(cls, sid, data):
//         try:
//             response = await func(cls, cls.clients[sid], data)
//         except HandlerException as e:
//             logging.error('{}{}'.format(
//                 e.log if e.log is not None else str(e),
//                 ' ({})'.format(e.exc) if e.exc is not None else ''))
//             response = cls.socket_response(data=None, message=Message(
//                 text=str(e),
//                 status=e.status,
//                 log=e.log))
//         except Exception as e:
//             logging.exception(e)
//             response = cls.socket_response(data=None, message=Message(
//                 text='An error occurred in the webserver.',
//                 status=500,
//                 log=str(e)))

//         return response

//     return wrapper


// def json_response(cls, data=None, message=None):
//     data = {'data': data}

//     if message is not None:
//         data['message'] = message

//     return web.json_response(
//         data=data,
//         status=200 if message is None else message.status)

// def socket_response(cls, data=None, message=None, status=None):
//     return status if status is not None else \
//         0 if message is None else \
//         message.status, data, message
