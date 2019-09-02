import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';

import { ErrorMsg, SimpleModal } from '../Util';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';

const initialState = {
    show: false,
    serverError: '',
};

const Remove = ({collection}) => {
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;

    const handleClickOpen = () => {
        setState({...state, show: true});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleClickOk = () => {
        ThingsdbActions.removeCollection(collection.name, (err) => setState({...state, serverError: err.log}));

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
                    {'Remove'}
                </Button>
            }
            title={`Remove collection ${collection.name}?`}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            <ErrorMsg error={serverError} onClose={handleCloseError} />
        </SimpleModal>
    );
};

Remove.propTypes = {
    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Remove;