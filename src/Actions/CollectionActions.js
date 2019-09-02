import {emit, useStore} from './BaseActions';


const CollectionActions = {
    query: (dispatch, collectionId, thingId=null, depth=1) => {
        emit('/collection/query', {
            collectionId: collectionId,
            thingId: thingId,
            depth: depth
        }).done((data) => {
            dispatch((state) => {
                const things = thingId ?
                    Object.assign({}, state.things, {[thingId]: data})
                    :
                    Object.assign({}, state.things, {[collectionId]: data});
                return {
                    things: things,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    removeThing: (dispatch, config) => {
        emit('/collection/remove-thing', config).done((data) => {
            dispatch((state) => {
                const things = Object.assign({}, state.things, {[config.thingId]: data});
                return{
                    things: things,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    rawQuery: (dispatch, collectionId, thingId, query) => {
        emit('/collection/raw-query', {
            collectionId: collectionId,
            thingId: thingId,
            query: query,
        }).done((data) => {
            dispatch((state) => {
                const things = Object.assign({}, state.things, {[thingId]: data});
                return{
                    things: things,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },

    queryWithOutput: (dispatch, collectionId, query, onOutput) => {
        emit('/collection/query-with-output', {
            collectionId: collectionId,
            query: query,
        }).done((data) => {
            onOutput(data.output);

            dispatch((state) => {
                const things = Object.assign({}, state.things, {[collectionId]: data.things});
                return{
                    things: things,
                };
            });
        }).fail((event, status, message) => dispatch(() => {
            return {
                error: message,
            };
        }));
    },
};

export {CollectionActions, useStore};
