import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {NodesActions} from '../../Stores/NodesStore';
import { ErrorMsg, SimpleModal } from '../Util';

const initialState = {
    show: false,
    errors: {},
    form: {},
};

const tag = '12';

const ReplaceNode = ({node}) => {
    const [addPort, setAddPort] = React.useState(false);
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const validation = {
        secret: () => form.secret.length>0,
        address: () => true,
        port: () => true,
    };

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

    const handleSetPort = () => {
        setAddPort(!addPort);
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {port: ''});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            NodesActions.replaceNode(
                {...form, nodeId: node.node_id},
                tag,
                () => setState({...state, show: false})
            );
        }
    };

    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <TextField
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
                id="address"
                label="Address"
                type="text"
                value={form.address}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.address}
            />
            <Typography component="div" variant="caption">
                <Grid component="label" container alignItems="center" spacing={2}>
                    <Grid item>
                        {'Add Port:'}
                    </Grid>
                    <Grid item>
                        {'no'}
                    </Grid>
                    <Grid item>
                        <Switch
                            checked={form.setPort}
                            color="primary"
                            onChange={handleSetPort}
                        />
                    </Grid>
                    <Grid item>
                        {'yes'}
                    </Grid>
                </Grid>
            </Typography>
            <Collapse in={addPort} timeout="auto" unmountOnExit>
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
            </Collapse>
        </React.Fragment>
    );


    return(
        <SimpleModal
            button={
                <IconButton onClick={handleClickOpen}>
                    <EditIcon />
                </IconButton>
            }
            title={`Replace node: ${node.address}`}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

ReplaceNode.propTypes = {
    node: PropTypes.object.isRequired,
};

export default ReplaceNode;