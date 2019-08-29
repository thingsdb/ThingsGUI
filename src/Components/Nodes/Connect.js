import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {withVlow} from 'vlow';

import { ErrorMsg, SimpleModal } from '../Util';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationActions';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['connErr']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {
        host: 'localhost:9200',
    },
    serverError: '',
};


const Connect = ({connErr, onConnected}) => {
    const [state, setState] = useState(initialState);
    const {show, errors, form, serverError} = state;

    const validation = {
        host: () => form.host.length>0,
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            ApplicationActions.connectOther(form, (err) => setState({...state, serverError: err.log}));

            if(!state.serverError) {
                setState({...state, show: false});
                onConnected();
            }
        }
    };

    const handleClickConnect = () => {
        setState({...state, show: true});
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    };

    const Content = (
        <React.Fragment>
            <ErrorMsg error={connErr || serverError} onClose={handleCloseError} />
            <TextField
                autoFocus
                margin="dense"
                id="host"
                label="Host"
                type="text"
                value={form.host}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.host}
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickConnect}>
                    {'Connect'}
                </Button>
            }
            title="Connect to other node"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

Connect.propTypes = {

    onConnected: PropTypes.func.isRequired,

    /* application properties */
    connErr: ApplicationStore.types.connErr.isRequired,
};

export default withStores(Connect);