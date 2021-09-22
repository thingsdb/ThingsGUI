import React from 'react';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import { ErrorMsg, SimpleModal } from '../../Util';
import {NodesActions} from '../../../Stores';
import {AddNodeTAG} from '../../../Constants/Tags';


const initialState = {
    show: false,
    errors: {},
    form: {},
    portSwitch: false,
};

const validation = {
    secret: (f) => {
        if (f.secret.length==0) {
            return 'is required';
        }
        return '';
    },
    nName: (f) => {
        if (f.nName.length==0) {
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

const tag = AddNodeTAG;

const Add = () => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, portSwitch} = state;

    const handleClickOpen = () => {
        setState({...state, show: true, errors: {}, portSwitch: false, form: {secret: '', nName: '', port: ''}}); // using nodeName would result in error.
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

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setState({...state, portSwitch: checked});
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
                id="nName"
                label="Node name"
                type="text"
                value={form.nName}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={Boolean(errors.nName)}
                helperText={errors.nName}
            />
            <FormControlLabel
                control={(
                    <Switch
                        checked={portSwitch}
                        color="primary"
                        id="portSwitch"
                        onChange={handleSwitch}
                    />
                )}
                label="Add port [optional]"
            />
            <Collapse in={portSwitch} timeout="auto" unmountOnExit>
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
            </Collapse>
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