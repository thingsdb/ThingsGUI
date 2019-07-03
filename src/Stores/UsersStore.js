/* eslint-disable no-unused-vars */
import React from 'react';
import {emit, useStore} from './BaseStore';


const UsersActions = {
    addUser: (dispatch, name, password) => () => {
        emit('/user/add', {
            name,
            password,
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    },
    removeUser: (dispatch, user) => () => {
        emit('/user/remove', {
            name
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    },
    renameUser: (dispatch, user, name) => () => {
        emit('/user/rename', {
            user,
            name,
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    },
    password: (dispatch, user, password) => () => {
        emit('/user/password', {
            user,
            password,
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    },
    grant: (dispatch, user, collection, access) => () => {
        emit('/grant', {
            collection,
            user,
            access,
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    },
    revoke: (dispatch, user, collection, access) => () => {
        emit('/revoke', {
            collection,
            user,
            access,
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    }
};

export {UsersActions, useStore};