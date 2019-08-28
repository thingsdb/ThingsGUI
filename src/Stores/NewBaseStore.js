/* global process */
import io from 'socket.io-client';
import React from 'react';


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
            if (status === 0) {
                window.console.debug(`Socket response ("${event}"):`, data);
                this._doneCb(data);
            } else if (status === 125) {
                // ConnectionActions.triggerSessionError();
            } else {
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

// store.js
const useStore = (store, keys) => {

    const setState = React.useState()[1];
    React.useEffect(() => {
        store.subscribe(setState, keys);
        return () => store.unsubscribe(setState);
    }, []);

    return store;

};

class BaseStore {

    constructor(){}

    _subscriptions = [];
    state = {};

    emit(name, data) {
        return new _SocketRequest(name, data);
    }

    subscribe(listener, keys) {
        this._subscriptions.push({listener, keys});
    }

    unsubscribe(listener) {
        this._subscriptions = this._subscriptions.filter((s) => s.listener !== listener);
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this._subscriptions.forEach(this._listen);
    }

    _listen = (s) => {
        // TODOK alleen update delta
        const listenState = s.keys.reduce((d, key) => {
            d[key] = this.state[key];
            return d;
        }, {});
        s.listener(listenState);
    }
}

export {useStore, BaseStore};