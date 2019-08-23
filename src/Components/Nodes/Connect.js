import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['connErr']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {
        host: 'localhost:9200',
    },
    serverError: '',
};


const Connect = ({connErr, onConnected}) => {
    const [state, setState] = useState(initialState);
    const {show, errors, form, serverError} = state;

    const validation = {
        host: () => form.host.length>0,
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickCancel = () => {
        setState({...state, show: false});
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            ApplicationActions.connectOther(form, (err) => setState({...state, serverError: err.log}));

            if(!state.serverError) {
                setState({...state, show: false});
                onConnected();
            }
        }
    };

    const handleClickConnect = () => {
        setState({...state, show: true});
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickConnect}>
                {'Connect'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickCancel}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Connect to other node'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {connErr || serverError}
                        </Typography>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="host"
                        label="Host"
                        type="text"
                        value={form.host}
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.host}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCancel} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                        {'Connect'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
};

Connect.propTypes = {

    /* application properties */
    connErr: ApplicationStore.types.connErr.isRequired,
};

export default withStores(Connect);