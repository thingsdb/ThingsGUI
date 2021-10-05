import PropTypes from 'prop-types';
import React from 'react';


const EditActions = {
    update: (dispatch, data) => {
        dispatch(() => {
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
            Object.keys(copy).forEach(k=> {
                data.forEach(v=> {
                    if (keys[k]||v.includes(k)){
                        keys[k]=true;
                    } else {
                        keys[k]=false;
                    }
                });
            });
            Object.entries(keys).forEach(([k, v]) => !v&&delete copy[k]);
            return {blob: {...state.blob, ...copy}};
        });
    },
    addToArr: (dispatch, data) => {
        dispatch((state) => {
            let copy = [...state.array];
            copy.push(data);
            return {array: copy};
        });
    },
    deleteFromArr: (dispatch, index) => {
        dispatch((state) => {
            let copy = [...state.array];
            copy.splice(index, 1);
            return {array: copy};
        });
    },
    deleteReal: (dispatch, data) => {
        dispatch((state) => {
            let copy = {...state.real};
            let k = Object.keys(copy).find(i=>data.includes(i));
            delete copy[k];
            return {real: copy};
        });
    },
    updateReal: (dispatch, real) => {
        dispatch((state) => {
            let r = {};
            console.log(state, real)
            if (typeof real === 'object'){
                r = {...state.real, ...real};
            } else {
                r = real;
            }
            return {real: r};
        });
    },
    resetState: (dispatch) => {
        dispatch(() => {
            return {
                array: [],
                blob: {},
                error: '',
                real: {},
                query: '',
                val: '',
            };
        });
    },
};

const initialState = {
    array: [],
    blob: {},
    error: '',
    real: {},
    query: '',
    val: '',
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
    const memoValue = React.useMemo(() => ({state, dispatch}), [state, dispatch]);

    return (
        <StoreContext.Provider value={memoValue}>
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
