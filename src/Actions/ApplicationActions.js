import {emit, useStore} from './BaseActions';


const ApplicationActions = {

    connected: (dispatch) => {
        emit('/connected').done((data) => {
            setTimeout(() => {
                dispatch(() => {
                    return {
                        loaded: data.loaded,
                        connected: data.connected,
                    };
                });
            }, 1000);
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    connect: (dispatch, {host, user, password}) => {
        emit('/connect', {host, user, password}).done((data) => {
            dispatch(() => {
                return {
                    connErr: data.connErr,
                    connected: data.connected,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    connectOther: (dispatch, {host}) => {
        emit('/connect/other', {host}).done((data) => {
            dispatch(() => {
                return {
                    connErr: data.connErr, // QUEST: vangt deze alle errors af?
                    connected: data.connected,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    disconnect: (dispatch) => {
        emit('/disconnect').done(() => {
            dispatch(() => {
                return {
                    loaded: false,
                    connected: false,
                    connErr: '',
                    match: {},
                    things: {},
                    counters: {},
                    nodes: [],
                    node: {},
                    collections: [],
                    collection: {},
                    users: [],
                    user: {},
                    error: {
                        msg: {},
                        toast: [],
                    }
                };

            });
        }); //.fail((_xhr, {error}) => onError(error));
    },

    navigate: (dispatch, match) => {
        dispatch(() => {
            return {match};
        });
    },
};

export {ApplicationActions, useStore};