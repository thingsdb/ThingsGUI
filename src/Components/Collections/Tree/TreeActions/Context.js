/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';


const EditActions = {
    update: (dispatch, data) => {
        dispatch((state) => {
            return {...state, ...data};
        });
    },
    updateVal: (dispatch, data, identifier=null) => {
        dispatch((state) => {
            return identifier? {...state, val: {...state.val, [identifier]: data}} : {...state, val: data};
        });
    },
    deleteBlob: (dispatch, data) => {
        dispatch((state) => {
            let copy = JSON.parse(JSON.stringify(state.blob));
            let k = Object.keys(copy).find(i=>data.includes(i));
            delete copy[k];
            return {...state, blob: copy};
        });
    },
    updateBlob: (dispatch, data, blob) => {
        dispatch((state) => {
            let copy = JSON.parse(JSON.stringify({...state.blob, ...blob}));
            let keys={};
            Object.keys(copy).map((k)=> {
                data.map(v=> {
                    if (v.includes(k)){
                        keys[k]=true;
                    } else {
                        keys[k]=false;
                    }
                });
            });
            Object.entries(keys).map(([k, v]) => !v&&delete copy[k]);

            return {...state, blob: copy};
        });
    },
    addToArr: (dispatch, data) => {
        dispatch((state) => {
            const newArray = [...state.array];
            newArray.push(data);
            return {...state, array: newArray};
        });
    },
    deleteFromArr: (dispatch, index) => {
        dispatch((state) => {
            const newArray = [...state.array];
            newArray.splice(index, 1);
            return {...state, array: newArray};
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
