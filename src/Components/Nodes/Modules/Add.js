import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {ErrorMsg, SimpleModal, SwitchOpen} from '../../Util';
import {NodesActions} from '../../../Stores';
import {AddModuleTAG} from '../../../constants';

const initialState = {
    show: false,
    form: {
        name: '',
        file: '',
        config: '',
    },
    switches: {
        config: false,
    },
};

const tag = AddModuleTAG;

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

    const handleClickOk = () => {
        NodesActions.addModule(
            nodeId,
            {
                name: form.name,
                file: switches.time ? form.time : null,
                configuration: switches.config ? form.config : null,
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
                    {'Add module'}
                </Button>
            }
            title="New module"
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
                            <Link target="_blank" href="https://docs.thingsdb.net/v0/thingsdb-api/new_module/">
                                {'https://docs.thingsdb.net/v0/thingsdb-api/new_module/'}
                            </Link>
                        }
                    />
                </ListItem>
                <ListItem dense disableGutters>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={form.name}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                    />
                </ListItem>
                <ListItem dense disableGutters>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="file"
                        label="File path"
                        type="text"
                        value={form.file}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                    />
                </ListItem>
                <ListItem dense disableGutters>
                    <SwitchOpen label="Add configuration [optional]" onChange={handleSwitch('config')}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="config"
                            label="Configuration"
                            type="text"
                            value={form.config}
                            spellCheck={false}
                            onChange={handleOnChange}
                            multiline
                            rows="2"
                            rowsMax="10"
                            fullWidth
                        />
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