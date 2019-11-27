import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Switch from '@material-ui/core/Switch';

import { ErrorMsg, SimpleModal, TimePicker, TimePeriodPicker } from '../../Util';
import {NodesActions} from '../../../Stores';

const initialState = {
    show: false,
    form: {},
    switches: {
        time: false,
        repeat: false,
    },
};

const tag = '20';

const Add = ({node}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, switches} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            form: {
                file: '',
                time: '',
                repeat: '',
            },
            switches: {
                time: false,
                repeat: false,
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

    const handleTime = (time) => {
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {time: time});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleRepeat = (repeat) => {
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {repeat: repeat});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        NodesActions.addBackup(
            node.node_id,
            {
                file: form.file,
                time: switches.time ? form.time : null,
                repeat: switches.repeat ? form.repeat : null,
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
                    <TextField
                        autoFocus
                        margin="dense"
                        id="file"
                        label="File"
                        type="text"
                        value={form.file}
                        spellCheck={false}
                        onChange={handleOnChange}
                        placeholder="/tmp/example.tar.gz"
                        fullWidth
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={switches.time}
                                color="primary"
                                id="time"
                                onChange={handleSwitch}
                            />
                        )}
                        label="Add time [optional]"
                    />
                </ListItem>
                <Collapse in={switches.time} timeout="auto" unmountOnExit>
                    <ListItem>
                        <TimePicker cb={handleTime} />
                    </ListItem>
                </Collapse>
                <ListItem>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={switches.repeat}
                                color="primary"
                                id="repeat"
                                onChange={handleSwitch}
                            />
                        )}
                        label="Add continuous repeat [optional]"
                    />
                </ListItem>
                <Collapse in={switches.repeat} timeout="auto" unmountOnExit>
                    <ListItem>
                        <TimePeriodPicker cb={handleRepeat} />
                    </ListItem>
                </Collapse>
            </List>
        </React.Fragment>
    );


    return (
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Add backup'}
                </Button>
            }
            title="New backup"
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
    node: PropTypes.object.isRequired,
};

export default Add;