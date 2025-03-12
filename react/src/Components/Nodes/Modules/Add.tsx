import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {AddModuleTAG} from '../../../Constants/Tags';
import {Arguments, EditProvider, ErrorMsg, SimpleModal, SwitchOpen} from '../../Utils';
import {NodesActions} from '../../../Stores';
import {THINGS_DOC_NEW_MODULE} from '../../../Constants/Links';

const initialState = {
    confErr: '',
    show: false,
    form: {
        name: '',
        source: '',
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

    const handleOnChangeConf = (config) => {
        setState(prevState => {
            return {...prevState, form: {...prevState.form, config}};
        });
    };

    const handleClickOk = () => {
        const conf = switches.config ? form.config : null;
        NodesActions.addModule(
            nodeId,
            {
                name: form.name,
                source: form.source,
                configuration: conf,
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
            maxWidth="sm"
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
            onOk={handleClickOk}
            open={show}
            title="New module"
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
                        fullWidth
                        id="name"
                        label="Name"
                        margin="dense"
                        onChange={handleOnChange}
                        spellCheck={false}
                        type="text"
                        value={form.name}
                        variant="standard"
                    />
                </ListItem>
                <ListItem dense disableGutters>
                    <TextField
                        fullWidth
                        id="source"
                        label="Source"
                        margin="dense"
                        onChange={handleOnChange}
                        spellCheck={false}
                        type="text"
                        value={form.source}
                        variant="standard"
                    />
                </ListItem>
                <ListItem dense disableGutters>
                    <SwitchOpen label="Add configuration [optional]" onChange={handleSwitch('config')}>
                        <EditProvider>
                            <Arguments onChange={handleOnChangeConf} />
                        </EditProvider>
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