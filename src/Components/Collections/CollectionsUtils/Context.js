/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';


const EditActions = {
    update: (dispatch, data) => {
        dispatch((state) => {
            return {...data};
        });
    },
    updateVal: (dispatch, data, identifier=null) => {
        dispatch((state) => {
            return identifier? {val: {...state.val, [identifier]: data}} : {val: data};
        });
    },
    deleteBlob: (dispatch, data) => {
        dispatch((state) => {
            let copy = JSON.parse(JSON.stringify(state.blob)); //copy
            let k = Object.keys(copy).find(i=>data.includes(i));
            delete copy[k];
            return {blob: copy};
        });
    },
    updateBlob: (dispatch, data, blob) => {
        dispatch((state) => {
            let copy = JSON.parse(JSON.stringify(blob)); //copy
            let keys={};
            Object.keys(copy).map(k=> {
                data.map(v=> {
                    if (keys[k]||v.includes(k)){
                        keys[k]=true;
                    } else {
                        keys[k]=false;
                    }
                });
            });
            Object.entries(keys).map(([k, v]) => !v&&delete copy[k]);
            return {blob: {...state.blob, ...copy}};
        });
    },
    addToArr: (dispatch, data) => {
        dispatch((state) => {
            const newArray = [...state.array];
            newArray.push(data);
            return {array: newArray};
        });
    },
    deleteFromArr: (dispatch, index) => {
        dispatch((state) => {
            const newArray = [...state.array];
            newArray.splice(index, 1);
            return {array: newArray};
        });
    },
};

const initialState = {
    query: '',
    blob: {},
    val: '',
    error: '',
    array: [],
};

const StoreContext = React.createContext(initialState);

const useEdit = () => {
    const {state, dispatch} = React.useContext(StoreContext);
    return [state, dispatch];
};

const reducer = (state, action) => {
    const update = action(state);
    return { ...state, ...update };
};

const EditProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

EditProvider.propTypes = {
    children: PropTypes.node,
};

EditProvider.defaultProps = {
    children: null,
};

export {EditActions, EditProvider, useEdit};
