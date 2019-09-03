import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ErrorMsg, SimpleModal } from '../Util';
import {NodesActions} from '../../Stores/NodesStore';


const initialState = {
    show: false,
    errors: {},
    form: {},
};

const tag = '8';

const AddNode = () => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const validation = {
        secret: () => form.secret.length>0,
        ipAddress: () => form.ipAddress.length>0, // TODOs validate regex
        port: () => true,
    };

    const handleClickOpen = () => {
        setState({...state, show: true, errors: {}, form: {secret: '', ipAddress: '', port: ''}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };


    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            const success = NodesActions.addNode(
                form,
                tag
            );
            if (success) {
                setState({...state, show: false});
            }
        }
    };


    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <TextField
                autoFocus
                margin="dense"
                id="secret"
                label="Secret"
                type="text"
                value={form.secret}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.secret}
            />
            <TextField
                margin="dense"
                id="ipAddress"
                label="IP address"
                type="text"
                value={form.ipAddress}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.ipAddress}
            />
            <TextField
                margin="dense"
                id="port"
                label="Port"
                type="text"
                value={form.port}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.port}
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Add node'}
                </Button>
            }
            title="Add Node"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

export default AddNode;