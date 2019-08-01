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
import {withVlow} from 'vlow';

import {UsersActions} from '../../Stores/UsersStore';
import {CollectionsStore} from '../../Stores/CollectionsStore';


const withStores = withVlow([{
    store: CollectionsStore,
    keys: ['collections']
}]);

const privileges = [
    'READ',
    'MODIFY',
    'WATCH',
    'GRANT',
    'FULL',
];

const initialState = {
    show: false,
    errors: {},
    form: {},
    serverError: '',
};

const Grant = ({user, collections}) => {

    const [state, setState] = React.useState(initialState);
    const {show, errors, form, serverError} = state;

    const targets = [
        {name: 'ThingsDB', value: '.thingsdb'},
        {name: 'Node', value: '.node'},
        ...collections.map((c) => ({name: c.name, value: c.name}))
    ];

    const validation = {
        target: () => form.target.length>0,
        privileges: () => form.privileges.length>0,
    };


    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                target: user.access.length?user.access[0].target:'.thingsdb',
                privileges: user.access.length?user.access[0].privileges:'READ',
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
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
            UsersActions.grant(
                user.name, 
                form.target, 
                form.privileges, 
                (err) => setState({...state, serverError: err})
            );

            if (!state.serverError){
                setState({...state, show: false});
            }
        }
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Grant'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Grant user privileges'}
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
                        id="target"
                        label="Collection"
                        value={form.target}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.target}
                        helperText={errors.target?'Select a collection':null}
                        select
                        SelectProps={{native: true}}
                    >
                        {targets.map(c => (
                            <option key={c.value} value={c.value}>
                                {c.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        id="privileges"
                        label="Privileges"
                        value={form.privileges}
                        onChange={handleOnChange}
                        fullWidth
                        error={errors.privileges}
                        helperText={errors.privileges?'Select privileges':null}
                        select
                        SelectProps={{native: true}}
                    >
                        {privileges.map(p => (
                            <option key={p} value={p}>
                                {p.toLowerCase()}
                            </option>
                        ))}
                    </TextField>
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

Grant.propTypes = {
    user: PropTypes.object.isRequired,

    /* collections properties */
    collections: CollectionsStore.types.collections.isRequired,
};

export default withStores(Grant);