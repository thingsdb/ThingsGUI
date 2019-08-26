import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';

import { ErrorMsg, SimpleModal } from '../Util';
import {NodesActions} from '../../Stores/NodesStore';

const initialState = {
    show: false,
    serverError: '',
};

const CountersReset = ({node}) => {   
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;

    const handleClickOpen = () => {
        setState({...state, show: true});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };
    const handleClickOk = () => {
        NodesActions.shutdown(node, (err) => setState({...state, serverError: err.log}));
        
        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    return(
        <SimpleModal 
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Shutdown'}
                </Button>         
            }
            title={'Shutdown node?'}
            content={<ErrorMsg error={serverError} onClose={handleCloseError} />}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        />
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default CountersReset;