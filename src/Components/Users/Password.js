import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const initialState = {
    show: false,
    showPassword: false,
    errors: {},
    form: {},
    serverError: '',
};

const Password = ({user}) => {
    const [state, setState] = React.useState(initialState);
    const {show, showPassword, errors, form, serverError} = state;

    const validation = {
        password: () => form.password.length>0,
    };

    const handleClickOpen = () => {
        setState({...state, show: true, showPassword: false, errors: {}, form: {...user, password: ''}, serverError: ''});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(errors).some(d => d)) {
            ThingsdbActions.password(
                user.name,
                form.password,
                (err) => setState({...state, serverError: err.log})
            );

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    const handleClickReset = () => {
        if (!Object.values(errors).some(d => d)) {
            ThingsdbActions.resetPassword(
                user.name,
                (err) => setState({...state, serverError: err.log})
            );

            if (!state.serverError) {
                setState({...state, show: false});
            }
        }
    };

    const handleClickShowPassword = () => {
        setState({...state, showPassword: !showPassword});
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    }

    const Content =
        <React.Fragment>
            <ErrorMsg error={serverError} onClose={handleCloseError} />
            <Typography component="div">
                <FormLabel component="legend">{'Set?'}</FormLabel>
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>{'no'}</Grid>
                    <Grid item>
                        <Switch
                            checked={user.has_password}
                            color={'primary'}
                            onChange={()=>null}
                        />
                    </Grid>
                    <Grid item>{'yes'}</Grid>
                </Grid>
            </Typography>
            <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type={showPassword?'text':'password'}
                value={form.password}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.password}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </React.Fragment>
    ;

    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title={'Password'} />
            }
            actionButtons={
                <Button onClick={handleClickReset} color="primary">
                    {'Reset'}
                </Button>
            }
            title={'Password'}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

Password.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Password;