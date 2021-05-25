import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { CardButton, ErrorMsg, SimpleModal } from '../../Util';
import {ThingsdbActions} from '../../../Stores';
import {PasswordTAG} from '../../../Constants/Tags';


const initialState = {
    show: false,
    showPassword: false,
    errors: {},
    form: {},
};

const validation = {
    password: (f) => {
        if (f.password.length==0) {
            return 'is required';
        }
        return '';
    },
};

const tag = PasswordTAG;

const Password = ({user}) => {
    const [state, setState] = React.useState(initialState);
    const {show, showPassword, errors, form} = state;

    const handleClickOpen = () => {
        setState({...state, show: true, showPassword: false, errors: {}, form: {password: '', set: user.has_password}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky](form);  return d; }, {});
        setState({...state, errors: err});
        if (form.set) {
            if (!Object.values(err).some(d => Boolean(d))) {
                ThingsdbActions.password(
                    user.name,
                    form.password,
                    tag,
                    () => setState({...state, show: false})
                );
            }
        } else {
            ThingsdbActions.resetPassword(
                user.name,
                tag,
                () => setState({...state, show: false})
            );
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    const handleSetPassword = ({target}) => {
        const {checked} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {set: checked});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickShowPassword = () => {
        setState({...state, showPassword: !showPassword});
    };


    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <Typography component="div" variant="caption">
                {!form.set && !user.tokens.length ? (
                    <FormLabel component="label" error>
                        {`This user has no access tokens. Resetting the password would lock out ${user.name}.`}
                    </FormLabel>
                ) : null}
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>
                        {'no'}
                    </Grid>
                    <Grid item>
                        <Switch
                            checked={form.set}
                            color="primary"
                            onChange={handleSetPassword}
                        />
                    </Grid>
                    <Grid item>
                        {'yes'}
                    </Grid>
                </Grid>
            </Typography>
            {form.set ? (
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
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button color="primary" onClick={handleClickShowPassword}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            ) : null}
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title="Password" />
            }
            title="Set Password"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Password.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Password;