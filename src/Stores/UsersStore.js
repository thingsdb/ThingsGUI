/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import {emit, useStore} from './BaseStore';


const UsersActions = {
    users: (dispatch) => () => {
        emit('/users', {
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    },
    addUser: (dispatch, name, password) => () => {
        emit('/user/add', {
            name,
            password,
        }).done((data) => dispatch((state) => {
            return {users: data};
        }));
    },
    removeUser: (dispatch, name) => () => {
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

const initialState = {
    users: [],
};

const StoreContext = React.createContext(initialState);

const useUsers = () => {
    const {state, dispatch} = React.useContext(StoreContext);
    return [state, dispatch];
};

const reducer = (state, action) => {
    const update = action(state);
    return {...state, ...update};
};

const UsersProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

UsersProvider.propTypes = {
    children: PropTypes.node,
};

UsersProvider.defaultProps = {
    children: null,
};

export {UsersActions, UsersProvider, useUsers};