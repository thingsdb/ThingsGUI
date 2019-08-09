import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import {CollectionsActions} from '../../Stores/CollectionsStore';
import ServerError from '../Util/ServerError';

const quotaTypes = [
    'things',
    'properties',
    'array_size',
    'raw_size',
];

const initialState = {
    show: false,
    form: {},
    serverError: '',
};

const Quotas = ({collection}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, serverError} = state;


    const _getQuota = (quotaType) => collection[`quota_${quotaType}`]||'';

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                quotaType: 'things',
                quota: _getQuota('things'),
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {quotaType: value, quota: _getQuota(value)});
            return {...prevState, form: updatedForm};
        });
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleUnset = () => {
        CollectionsActions.setQuota(
            collection.name, 
            form.quotaType, 
            "nil", 
            (err) => setState({...state, serverError: err.log})
        );

        if (!state.serverError) {
            setState({...state, show: false});
        }
    }

    const handleClickOk = () => {
        CollectionsActions.setQuota(
            collection.name, 
            form.quotaType, 
            form.quota, 
            (err) => setState({...state, serverError: err.log})
        );

        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Quotas'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Set quotas'}
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
                        id="quota"
                        label="Type"
                        value={form.quotaType}
                        onChange={handleOnChangeType}
                        fullWidth
                        select
                        SelectProps={{native: true}}
                    >
                        {quotaTypes.map(p => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="quota"
                        inputProps={{min: "1"}}
                        label="Quota"
                        type="number"
                        value={form.quota}  // TODOK placeholder
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUnset} color="primary">
                        {'Unset quota'}
                    </Button>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary">
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Quotas.propTypes = {
    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Quotas;