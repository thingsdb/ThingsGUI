/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import {emit} from './BaseStore';


const CollectionsActions = {
    collections: (dispatch) => () => {
        emit('/collections', {
        }).done((data) => dispatch((state) => {
            return {collections: data};
        }));
    },
    addCollection: (dispatch, name) => () => {
        emit('/collection/add', {
            name,
        }).done((data) => dispatch((state) => {
            return {collections: data};
        }));
    },
    renameCollection: (dispatch, collection, name) => () => {
        emit('/collection/rename', {
            collection,
            name,
        }).done((data) => dispatch((state) => {
            return {collections: data};
        }));
    },
    removeCollection: (dispatch, collection) => () => {
        emit('/collection/remove', {
            collection,
        }).done((data) => dispatch((state) => {
            return {collections: data};
        }));
    },
    setQuota: (dispatch, collection, quotaType, quota) => () => {
        emit('/collection/setquota', {
            collection,
            quotaType,
            quota,
        }).done((data) => dispatch((state) => {
            return {collections: data};
        }));
    },

    query: (dispatch, collection) => () => {
        emit('/collection/query', {
            collectionId: collection.collection_id,
        }).done((data) => dispatch((state) => {
            window.console.log(data, collection);
            const {things} = state;
            things[collection.collection_id] = data;
            return {
                collectionId: collection.collection_id,
                collectionName: collection.name,
                things,
            };
        }));
    },
    queryThing: (dispatch, collection, thing) => () => {
        emit('/collection/query', {
            collectionId: collection.collection_id,
            thingId: thing['#'],
        }).done((data) => dispatch((state) => {
            window.console.log(data);
            const {things} = state;
            things[thing['#']] = data;
            return {things};
        }));
    },
};

const initialState = {
    collections: [],
    collection: null,
    things: {},
};

const StoreContext = React.createContext(initialState);

const useCollections = () => {
    const { state, dispatch } = React.useContext(StoreContext);
    return [state, dispatch];
};

const reducer = (state, action) => {
    const update = action(state);
    return { ...state, ...update };
};

const CollectionsProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

CollectionsProvider.propTypes = {
    children: PropTypes.node,
};

CollectionsProvider.defaultProps = {
    children: null,
};

export {CollectionsActions, CollectionsProvider, useCollections};