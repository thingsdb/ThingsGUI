import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';



const initialState = {
    show: false,
    serverError: '',
};

const Remove = ({user}) => {
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;

    const handleClickOpen = () => {
        setState({...state, show: true});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };
    const handleClickOk = () => {
        ThingsdbActions.removeUser(user.name, (err) => setState({...state, serverError: err.log}));
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
                <CardButton onClick={handleClickOpen} title="Remove" />
            }
            title="Remove user?"
            content={<ErrorMsg error={serverError} onClose={handleCloseError} />}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        />
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Remove;