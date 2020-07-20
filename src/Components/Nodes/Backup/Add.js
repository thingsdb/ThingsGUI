import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { ErrorMsg, SimpleModal, TimePicker, TimePeriodPicker } from '../../Util';
import {NodesActions} from '../../../Stores';
import {AddBackupTAG} from '../../../constants';

const initialState = {
    show: false,
    form: {
        file: '',
        time: '',
        repeat: '',
        maxFiles: '',
    },
    switches: {
        time: false,
        repeat: false,
    },
};

const tag = AddBackupTAG;

const Add = ({nodeId}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, switches} = state;

    const handleClickOpen = () => {
        setState({
            ...initialState,
            show: true,
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
            nodeId,
            {
                file: form.file,
                time: switches.time ? form.time : null,
                repeat: switches.repeat ? form.repeat : null,
                maxFiles: form.maxFiles
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
                    <ListItemText
                        primary="For more information, see:"
                        secondary={
                            <Link target="_blank" href="https://docs.thingsdb.net/v0/node-api/new_backup/">
                                {'https://docs.thingsdb.net/v0/node-api/new_backup/'}
                            </Link>
                        }
                    />
                </ListItem>
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
                    <ListItem>
                        <ListItemText
                            primary="Maximum files stored"
                            primaryTypographyProps={{
                                variant: 'caption'
                            }}
                            secondary={
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="maxFiles"
                                    inputProps={{min: '1'}}
                                    type="number"
                                    value={form.maxFiles}
                                    spellCheck={false}
                                    onChange={handleOnChange}
                                    fullWidth
                                />
                            }
                            secondaryTypographyProps={{
                                component: 'div'
                            }}
                        />
                    </ListItem>
                </Collapse>
            </List>
        </React.Fragment>
    );


    return (
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
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
    nodeId: PropTypes.number.isRequired,
};

export default Add;