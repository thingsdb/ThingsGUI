import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withVlow} from 'vlow';

import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import ServerError from '../Util/ServerError';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['nodes']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '', 
};

const ReplaceNode = ({nodes}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const validation = {
        secret: () => form.secret.length>0,
        port: () => true,
    };

    const handleClickOpen = () => {
        setState({...state, show: true, errors: {}, form: {nodeId: '', secret: '', port: ''}, serverError: ''});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChangeId = (e) => {
        form[e.target.id] = e.target.value;
        setState({...state, form});
    };

    const handleOnChange = (e) => {
        form[e.target.id] = e.target.value;
        errors[e.target.id] = !validation[e.target.id]();
        setState({...state, form, errors});
    };

    const handleClickOk = () => {
        const errors = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors});
        if (!Object.values(errors).some(d => d)) {
            NodesActions.replaceNode(
                form,
                (err) => setState({...state, serverError: err.log})
            );
            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Replace Node'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Replace node'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {serverError}
                        </Typography>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nodeId"
                        label="Node ID"
                        value={form.nodeId}
                        onChange={handleOnChangeId}
                        fullWidth
                        select
                        SelectProps={{native: true}}
                    >
                        {nodes.map(p => (
                            <option key={p.node_id} value={p.node_id}>
                                {p.node_id}
                            </option>
                        ))}
                    </TextField>
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
                        id="port"
                        label="Port"
                        type="text"
                        value={form.port}
                        spellCheck={false}
                        onChange={handleOnChange} 
                        fullWidth
                        error={errors.port}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

ReplaceNode.propTypes = {
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(ReplaceNode);