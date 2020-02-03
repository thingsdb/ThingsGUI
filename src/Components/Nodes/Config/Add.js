import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ErrorMsg, SimpleModal } from '../../Util';
import {NodesActions} from '../../../Stores';


const initialState = {
    show: false,
    errors: {},
    form: {},
};

const validation = {
    secret: (f) => {
        if (f.secret.length==0) {
            return 'is required';
        }
        return '';
    },
    address: (f) => {
        if (f.address.length==0) {
            return 'is required';
        }
        return '';
    },
    port: () => {
        // if (form.name.length==0) {
        //     return 'is required';
        // }
        return '';
    },
};

const tag = '16';

const Add = () => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const handleClickOpen = () => {
        setState({...state, show: true, errors: {}, form: {secret: '', address: '', port: ''}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };


    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky](form);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => Boolean(d))) {
            NodesActions.addNode(
                form,
                tag,
                () => setState({...state, show: false})
            );
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
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
                error={Boolean(errors.secret)}
                helperText={errors.secret}
            />
            <TextField
                margin="dense"
                id="address"
                label="IP address"
                type="text"
                value={form.address}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={Boolean(errors.address)}
                helperText={errors.address}
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
                error={Boolean(errors.port)}
                helperText={errors.port}
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Add node'}
                </Button>
            }
            title="Add Node"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

export default Add;