import PropTypes from 'prop-types';
import React from 'react';

import { ARRAY, THING } from '../../../Constants/ThingTypes';


const setState = (state, type, value, identifier=null, parent=null) => {
    let data = {};
    if(identifier !== null) {
        if(parent === THING) {
            if (typeof state[type] === 'object' ) {
                data = {[type]: {...state[type], [identifier]: value}};
            } else {
                data = {[type]: {[identifier]: value}};
            }
        } else if(parent === ARRAY) {
            if (Array.isArray(state[type])) {
                let copy = [...state[type]];
                copy[identifier] = value;
                data = {[type]: copy};
            } else {
                data = {[type]: [value]};
            }
        }
    } else {
        data = {[type]: value};
    }

    return({...data});
};

const EditActions = {
    update: (dispatch, type, value, identifier=null, parent=null) => {
        dispatch((state) => {
            return(setState(state, type, value, identifier, parent));
        });
    },
    updateBlob: (dispatch, data, blob) => {
        dispatch(() => {
            let updatedBlob = Object.entries(blob).reduce((res, [k, v]) => {
                if (data.some((item) => item.includes(k))) {
                    res[k] = v;
                }
                return(res);
            }, {});
            return {blob: updatedBlob};
        });
    },
    resetState: (dispatch) => {
        dispatch(() => ({
            blob: {},
            error: '',
            obj: {},
            query: '',
            val: '',
        }));
    },
};

const initialState: State = {
    blob: {},
    error: '',
    obj: {},
    query: '',
    val: '',
};

const StoreContext = React.createContext(initialState);

const useEdit = () => {
    const {state, dispatch} = React.useContext<any>(StoreContext);
    return [state, dispatch];
};

const reducer = (state, action) => {
    const update = action(state);
    return { ...state, ...update };
};

const EditProvider = ({
    children = null
}: Props) => {
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

export {EditActions, EditProvider, useEdit};


interface Props {
    [index: string]: any;
}

interface State {
    blob: any;
    error: string;
    obj: any;
    query: string;
    val: string;
}