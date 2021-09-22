import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {AddModuleTAG} from '../../../Constants/Tags';
import {ErrorMsg, SimpleModal, SwitchOpen} from '../../Util';
import {NodesActions} from '../../../Stores';
import {THINGS_DOC_NEW_MODULE} from '../../../Constants/Links';

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
                file: form.file,
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
                            <Link target="_blank" href={THINGS_DOC_NEW_MODULE}>
                                {'ThingsDocs'}
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
                        margin="dense"
                        id="file"
                        label="File"
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
                            margin="dense"
                            id="config"
                            label="Configuration"
                            type="text"
                            value={form.config}
                            spellCheck={false}
                            onChange={handleOnChange}
                            multiline
                            minRows="1"
                            maxRows="10"
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