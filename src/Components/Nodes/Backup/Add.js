import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import { ErrorMsg, SimpleModal, SwitchOpen, TimePicker, TimePeriodPicker } from '../../Util';
import {NodesActions} from '../../../Stores';
import {AddBackupTAG} from '../../../constants';

const initialState = {
    show: false,
    form: {
        file: '',
        time: null,
        repeat: '',
        maxFiles: '',
    },
    switches: {
        time: false,
        repeat: false,
        maxFiles: false,
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

    const handleSwitch = (ky) => (checked) => {
        setState(prevState => {
            const updatedSwitches = Object.assign({}, prevState.switches, {[ky]: checked});
            return {...prevState, switches: updatedSwitches};
        });
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            return {...prevState, form: {...prevState.form, [id]: value}};
        });
    };

    const handleChange = (ky) => (value) => {
        setState(prevState => {
            return {...prevState, form: {...prevState.form, [ky]: value}};
        });
    };

    const handleClickOk = () => {
        NodesActions.addBackup(
            nodeId,
            {
                file: form.file,
                time: switches.time ? form.time : null,
                repeat: switches.repeat ? form.repeat : null,
                maxFiles: switches.maxFiles ? form.maxFiles : null,
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
            <ErrorMsg tag={tag} />
            <List dense disablePadding>
                <ListItem dense disableGutters>
                    <ListItemText
                        primary="For more information, see:"
                        secondary={
                            <Link target="_blank" href="https://docs.thingsdb.net/v0/node-api/new_backup/">
                                {'https://docs.thingsdb.net/v0/node-api/new_backup/'}
                            </Link>
                        }
                    />
                </ListItem>
                <ListItem dense disableGutters>
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
                <ListItem dense disableGutters>
                    <SwitchOpen label="Add time [optional]" onChange={handleSwitch('time')}>
                        <TimePicker onChange={handleChange('time')} />
                    </SwitchOpen>
                </ListItem>
                <ListItem dense disableGutters>
                    <SwitchOpen label="Add continuous repeat [optional]" onChange={handleSwitch('repeat')}>
                        <TimePeriodPicker onChange={handleChange('repeat')} />
                        <SwitchOpen label="Add maximum to files stored [optional]" onChange={handleSwitch('maxFiles')}>
                            <ListItemText
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
                        </SwitchOpen>
                    </SwitchOpen>
                </ListItem>
            </List>
        </SimpleModal>
    );
};

Add.propTypes = {
    nodeId: PropTypes.number.isRequired,
};

export default Add;