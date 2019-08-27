import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';

import { ErrorMsg, SimpleModal } from '../Util';
import {NodesActions} from '../../Stores/NodesStore';


const initialState = {
    show: false,
    serverError: '',
};

const PopNode = () => {
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;

    const handleClickOpen = () => {
        setState({...state, show: true, serverError: ''});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleClickOk = () => {
        NodesActions.popNode((err) => setState({...state, serverError: err.log}));
        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    const Content = (
        <React.Fragment>
            <DialogContentText>
                {'Are you sure you want to remove the latest node?'}
            </DialogContentText>
            <ErrorMsg error={serverError} onClose={handleCloseError} />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Pop Node'}
                </Button>
            }
            title="CAUTION"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

export default PopNode;