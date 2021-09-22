import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Switch from '@mui/material/Switch';

import { ErrorMsg, SimpleModal, TimePicker } from '../../Util';
import {ThingsdbActions} from '../../../Stores';
import {AddTokenTAG} from '../../../Constants/Tags';


const initialState = {
    show: false,
    form: {},
    switches: {
        description: false,
        expirationTime: false,
    },
};

const tag = AddTokenTAG;

const Add = ({user}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, switches} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            form: {
                description: '',
                expirationTime: null,
            },
            switches: {
                description: false,
                expirationTime: false,
            },
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleSwitch = ({target}) => {
        const {id, checked} = target;
        setState(prevState => {
            const updatedSwitches = Object.assign({}, prevState.switches, {[id]: checked});
            return {...prevState, switches: updatedSwitches};
        });
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleExpirationTime = (expirationTime) => {
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {expirationTime: expirationTime});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        ThingsdbActions.newToken(
            {
                name: user.name,
                expirationTime: switches.expirationTime ? form.expirationTime : null,
                description: switches.description ? form.description : null,
            },
            tag,
            () => setState({...state, show: false})
        );
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
            <List>
                <ListItem>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={switches.description}
                                color="primary"
                                id="description"
                                onChange={handleSwitch}
                            />
                        )}
                        label="Add description [optional]"
                    />
                </ListItem>
                <Collapse in={switches.description} timeout="auto" unmountOnExit>
                    <ListItem>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            label="Description"
                            type="text"
                            value={form.description}
                            spellCheck={false}
                            onChange={handleOnChange}
                            fullWidth
                        />
                    </ListItem>
                </Collapse>
                <ListItem>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={switches.expirationTime}
                                color="primary"
                                id="expirationTime"
                                onChange={handleSwitch}
                            />
                        )}
                        label="Add expiration time [optional]"
                    />
                </ListItem>
                <Collapse in={switches.expirationTime} timeout="auto" unmountOnExit>
                    <ListItem>
                        <TimePicker onChange={handleExpirationTime} />
                    </ListItem>
                </Collapse>
            </List>
        </React.Fragment>
    );


    return (
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Add token'}
                </Button>
            }
            title="New token"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Add.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Add;