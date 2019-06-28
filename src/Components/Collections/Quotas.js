import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const quotaTypes = [
    'things', 
    'properties', 
    'array_size', 
    'raw_size',
];

const initialState = {
    show: false,
    form: {},
};

const Quotas = ({collection}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line
    const [state, setState] = React.useState(initialState);
    const {show, form} = state;

    const setQuotas = React.useCallback(AppActions.setQuota(dispatch, collection.name, form.quotaType, form.quota));

    const _getQuota = (quotaType) => collection[`quota_${quotaType}`]||'';

    const handleClickOpen = () => {
        setState({
            show: true, 
            errors: {}, 
            form: {
                quotaType: 'things',
                quota: _getQuota('things'),
            },
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChangeType = (e) => {
        form.quotaType = e.target.value;
        form.quota = _getQuota(e.target.value);
        setState({...state, form});
    };

    const handleOnChange = (e) => {
        form[e.target.id] = e.target.value?parseInt(e.target.value):'';
        setState({...state, form});
    };

    const handleClickOk = () => {
        setQuotas();
        setState({...state, show: false});
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                {'Quotas'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Set quotas'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* {connErr} */}
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
                        label="Quota"
                        type="number"
                        value={form.quota}  // TODOK placeholder
                        spellCheck={false}
                        onChange={handleOnChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
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
    collection: PropTypes.object.isRequired,
};

export default Quotas;