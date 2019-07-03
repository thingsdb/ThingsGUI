/* eslint-disable no-unused-vars */
import React from 'react';
import {emit, useStore} from './BaseStore';


const CollectionsActions = {
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
};

export {CollectionsActions, useStore};