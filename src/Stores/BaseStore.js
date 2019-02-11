/* global process */
import React from 'react';  // eslint-disable-line
import {MessageActions} from '../Stores/MessageStore.js';
import io from 'socket.io-client';
import Vlow from 'vlow';


const ConnectionActions = Vlow.createActions([
    'triggerSessionError'
]);

const socket = io.connect(`${window.location.protocol}//${window.location.host}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
});


class _SocketRequest {

    _doneCb() {
    }

    _failCb(event, status, data) {
        window.console.error(event, status, data);
    }

    _alwaysCb() {
    }

    constructor(event, ...data) {
        window.console.debug(`Socket request: "${event}"`, data);
        if (process.env.NODE_ENV === 'production') {
            window.console.trace();
        }

        const timer = 3;
        var warnOnLong = setTimeout(() => {
            window.console.warn(`No result for request "${event}" within ${timer} seconds.`);
        }, timer * 1000);

        socket.emit(event, ...data, (status, data, message) => {
            clearTimeout(warnOnLong);

            if (message !== undefined && message !== null) {
                MessageActions.add(message);
            }

            this._alwaysCb(status, data);
            if (status === 0) {
                if (window.debugMode) {
                    window.console.debug(`Socket response ("${event}"):`, data);
                }
                this._doneCb(data);
            } else if (status === 125) {
                ConnectionActions.triggerSessionError();
            } else {
                this._failCb(event, status, data);
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

class _JsonRequest {

    constructor(type, url, data) {

        this.doneCb = function (data) { };          // eslint-disable-line
        this.failCb = function (xhr, data) { };   // eslint-disable-line

        const xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-type', 'application/json');

        xhr.onreadystatechange = () => {
            if (xhr.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (xhr.status == 200) {
                const data = JSON.parse(xhr.responseText);
                this.doneCb(data);
            } else {
                let data;
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    data = null;
                }
                this.failCb(xhr, data);
            }
        };

        xhr.send((!data) ? null : JSON.stringify(data));
    }

    done(doneCb) {
        this.doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this.failCb = failCb;
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

class ConnectionStore extends BaseStore {

    constructor() {
        super(ConnectionActions);
        this.state = {
            connectionLost: false,
            connectionStatus: null,
            reconnectAttempt: 0,
        };

        this.getSocketObj().on('reconnect', () => {
            this.setState({
                connectionStatus: 'Succesful reconnected!'
            });
            setTimeout(() => {
                this.setState({
                    connectionLost: false,
                    connectionStatus: null
                });
            }, 2000);
        });

        this.getSocketObj().on('connect_failed', function () {
            // return this.getSocketObj().connect();
        });

        this.getSocketObj().on('connect', () => {
        });

        this.getSocketObj().on('reconnecting', (attempt) => {
            if (attempt >= 2) {
                this.setState({
                    connectionLost: true,
                    connectionStatus: `Connection lost, trying to reconnect... (attempt ${attempt})`
                });
            }
        });
    }

    onTriggerSessionError() {
        this.setState({
            connectionLost: true,
            connectionStatus: 'User session has expired, redirecting to login...'
        });
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
}

export {BaseStore, ConnectionStore};