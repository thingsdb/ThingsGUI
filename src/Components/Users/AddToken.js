import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {UsersActions, UsersStore} from '../../Stores/UsersStore';


const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});


const timeUnit = [
    {
        label: "Second",
        value: "1"
    },
    {
        label: "Minute",
        value: "60"
    },
    {
        label: "Hour",
        value: "60*60"
    },
    {
        label: "Day",
        value: "60*60*24"
    },
    {
        label: "Week",
        value: "60*60*24*7"
    },
];

const initialState = {
    show: false,
    form: {},
    switches: {
        description: false,
        expirationTime: false,
    },
    serverError: '',
};

const AddToken = ({classes, user}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, switches, serverError} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            form: {
                description: '',
                number: '1',
                timeUnit: timeUnit[0].value,
            },
            switches: {
                description: false,
                expirationTime: false,
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleSwitch = ({target}) => {
        const {id, checked} = target;
        setState(prevState => {
            const updatedSwitches = Object.assign({}, prevState.switches, {[id]: checked});
            return {...prevState, switches: updatedSwitches};
        });
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickOk = () => {
        UsersActions.newToken(
            {
                name: user.name, 
                expirationTime: switches.expirationTime ? "(now() + " + form.number + "*" + form.timeUnit + ")" : null, 
                description: switches.description ? form.description : null
            }, 
            (err) => setState({...state, serverError: err.log})
        );
        
        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const now = new Date().toISOString().substring(0, 16);

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Add Token'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'New token'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {serverError}
                        </Typography>   
                    </DialogContentText>
                    <List>
                        <ListItem>
                            <FormControlLabel
                                control={(
                                    <Switch
                                        checked={switches.description}
                                        color="primary"
                                        id="description"
                                        onChange={handleSwitch}
                                    />
                                )}
                                label="Add description [optional]"
                            />
                        </ListItem>
                        <Collapse in={switches.description}>
                            <ListItem>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="description"
                                    label="Description"
                                    type="text"
                                    value={form.description}
                                    spellCheck={false}
                                    onChange={handleOnChange}
                                    fullWidth
                                />
                            </ListItem>
                        </Collapse>
                        <ListItem>
                            <FormControlLabel
                                control={(
                                    <Switch
                                        checked={switches.expirationTime}
                                        color="primary"
                                        id="expirationTime"
                                        onChange={handleSwitch}
                                    />
                                )}
                                label="Add expiration time [optional]"
                            />
                        </ListItem>
                        <Collapse in={switches.expirationTime}>
                            <ListItem>
                                <Grid item container xs={12} spacing={1} >
                                    <Grid item xs={3}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="number"
                                            inputProps={{min: "1"}}
                                            type="number"
                                            value={form.number}  // TODOK placeholder
                                            spellCheck={false}
                                            onChange={handleOnChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            margin="dense"
                                            id="timeUnit"
                                            value={form.timeUnit}
                                            onChange={handleOnChange}
                                            fullWidth
                                            select
                                            SelectProps={{native: true}}
                                        >
                                            {timeUnit.map(({label, value}) => (
                                                <option key={label} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid> 
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <TextField
                                    id="datetime-local"
                                    label="UTC TIME [NOT IN USE]"
                                    type="datetime-local"
                                    defaultValue={now}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />   
                            </ListItem>   
                        </Collapse>          
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary" >
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

AddToken.propTypes = {
    /* styles properties */
    classes: PropTypes.object.isRequired,


    user: PropTypes.object.isRequired,  
};

export default withStyles(styles)(AddToken); // QUEST: volgorde goed zo?