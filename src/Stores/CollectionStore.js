/* eslint-disable no-unused-vars */
import React from 'react';
import {emit, useStore} from './BaseStore';

const collectionInitialState = {
    things: {},
};

const CollectionActions = {

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

export {CollectionActions, collectionInitialState, useStore};
