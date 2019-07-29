import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';
import ServerError from '../Util/ServerError';

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


const Connect = ({connErr}) => {
    const [state, setState] = useState(initialState);
    const {show, errors, form, serverError} = state;
   
    const validation = {
        host: () => form.host.length>0,
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
            ApplicationActions.connectOther(form, (err) => setState({...state, serverError: err}));
            
            if(!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    const handleClickConnect = () => {
        setState({...state, show: true});
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickConnect}>
                {'Connect'}
            </Button>
            <Dialog
                open={show}
                onClose={() => null}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Connect to other node'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {connErr || serverError}
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