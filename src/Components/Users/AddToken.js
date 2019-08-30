import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Switch from '@material-ui/core/Switch';

import { ErrorMsg, SimpleModal } from '../Util';
import ThingsdbActions from '../../Actions/ThingsdbActions';



const timeUnit = [
    {
        label: 'Second',
        value: '1'
    },
    {
        label: 'Minute',
        value: '60'
    },
    {
        label: 'Hour',
        value: '60*60'
    },
    {
        label: 'Day',
        value: '60*60*24'
    },
    {
        label: 'Week',
        value: '60*60*24*7'
    },
];

const initialState = {
    show: false,
    form: {},
    switches: {
        description: false,
        expirationTime: false,
    },
};

const AddToken = ({user}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, switches} = state;

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
        ThingsdbActions.newToken(
            {
                name: user.name,
                expirationTime: switches.expirationTime ? '(now() + ' + form.number + '*' + form.timeUnit + ')' : null,
                description: switches.description ? form.description : null
            }
        );

        setState({...state, show: false});
    };

    const now = new Date().toISOString().substring(0, 16);

    const Content = (
        <React.Fragment>
            {/* <ErrorMsg error={serverError} onClose={handleCloseError} /> */}
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
                <Collapse in={switches.description} timeout="auto" unmountOnExit>
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
                <Collapse in={switches.expirationTime} timeout="auto" unmountOnExit>
                    <ListItem>
                        <Grid item container xs={12} spacing={1} >
                            <Grid item xs={3}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="number"
                                    inputProps={{min: '1'}}
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
        </React.Fragment>
    );


    return (
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Add token'}
                </Button>
            }
            title="New token"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

AddToken.propTypes = {
    user: PropTypes.object.isRequired,
};

export default AddToken;