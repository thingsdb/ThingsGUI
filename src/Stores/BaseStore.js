import PropTypes from 'prop-types';
import React, { createContext, useReducer, useContext } from 'react';
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

    _failCb(event, status, data) {
        window.console.error(event, status, data);
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

export const emit = (event, data) => new _SocketRequest(event, data);

// TODOK
const initialState = {
    loaded: false,
    connected: false,
    connErr: '',
    match: {},

    collections: [],
    nodes: [],
    users: [],
    node: null,
    counters: null,
    collection: null,
    things: {},
};

export const StoreContext = createContext(initialState);


const reducer = (state, action) => {
    const update = action(state);
    return { ...state, ...update };
};

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

StoreProvider.propTypes = {
    children: PropTypes.node
};

StoreProvider.defaultProps = {
    children: null,
};

export const useStore = () => {
    const { state, dispatch } = useContext(StoreContext);
    return [state, dispatch];
};