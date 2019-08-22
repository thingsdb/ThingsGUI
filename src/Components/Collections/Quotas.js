import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import {ThingsdbActions} from '../../Stores/ThingsdbStore';

const useStyles = makeStyles(theme => ({
    card: {
        width: 150,
        height: 150,
        textAlign: 'center',
        borderRadius: '50%',
        margin: theme.spacing(1),
    },
    wrapper: {
        width: 150,
        height: 150,
        textAlign: 'center',
        borderRadius: '50%',
        padding: theme.spacing(2),
    },
}));

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
    const classes = useStyles();
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
        ThingsdbActions.setQuota(
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
        ThingsdbActions.setQuota(
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
            <Card
                className={classes.card}
                raised
            >
                <CardActionArea
                    focusRipple
                    className={classes.wrapper}
                    onClick={handleClickOpen}
                >
                    <CardContent>
                        <Typography variant={'h6'} >
                            {'Quotas'}
                        </Typography> 
                    </CardContent>
                </CardActionArea>
            </Card>
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