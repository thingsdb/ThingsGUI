/* global process */
import PropTypes from 'prop-types';
import Vlow from 'vlow';
import io from 'socket.io-client';

const socket = io.connect(`${window.location.protocol}//${window.location.host}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ['websocket']
});

class _SocketRequest {

    _doneCb() {
    }

    _failCb(event, status, message) {
        window.console.error(event, status, message);
    }

    _alwaysCb() {
    }

    constructor(event, ...data) {
        window.console.debug(`Socket request: "${event}"`, data);

        var warnOnLong = setTimeout(() => {
            window.console.warn(`No result for request "${event}" within 3 seconds.`);
        }, 3000);

        socket.emit(event, ...data, (status, data, message) => {
            clearTimeout(warnOnLong);

            if (message !== undefined && message !== null) {
                // MessageActions.add(message);
            }

            this._alwaysCb(status, data);
            
            console.log(status, data, message);
            if (status === 0) {
                console.log('done');
                window.console.debug(`Socket response ("${event}"):`, data);
                this._doneCb(data);
            } else if (status === 125) {
                console.log('status: 125');
                // ConnectionActions.triggerSessionError();
            } else {
                console.log('fail');
                this._failCb(event, status, message);
            }
        });
    }

    done(doneCb) {
        this._doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this._failCb = failCb;
        return this;
    }

    always(alwaysCb) {
        this._alwaysCb = alwaysCb;
        return this;
    }
}

class BaseStore extends Vlow.Store {

    getSocketObj() {
        return socket;
    }

    emit(name, data) {
        return new _SocketRequest(name, data);
    }

    post(url, data) {
        return new _JsonRequest('POST', url, data);
    }
}

export default BaseStore;