import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { CardButton, ErrorMsg, SimpleModal } from '../../Utils';
import {ThingsdbActions} from '../../../Stores';
import {PasswordTAG} from '../../../Constants/Tags';


const initialState: State = {
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

const Password = ({user}: Props) => {
    const [state, setState] = React.useState(initialState);
    const {show, showPassword, errors, form} = state;

    const handleClickOpen = () => {
        setState(state => ({...state, show: true, showPassword: false, errors: {}, form: {password: '', set: user.has_password}}));
    };

    const handleClickClose = () => {
        setState(state => ({...state, show: false}));
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
                    () => setState(state => ({...state, show: false}))
                );
            }
        } else {
            ThingsdbActions.resetPassword(
                user.name,
                tag,
                () => setState(state => ({...state, show: false}))
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
        setState(state => ({...state, showPassword: !showPassword}));
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
                    <Grid>
                        {'no'}
                    </Grid>
                    <Grid>
                        <Switch
                            checked={form.set}
                            color="primary"
                            onChange={handleSetPassword}
                        />
                    </Grid>
                    <Grid>
                        {'yes'}
                    </Grid>
                </Grid>
            </Typography>
            {form.set ? (
                <TextField
                    autoFocus
                    error={Boolean(errors.password)}
                    fullWidth
                    helperText={errors.password}
                    id="password"
                    label="Password"
                    margin="dense"
                    onChange={handleOnChange}
                    spellCheck={false}
                    type={showPassword?'text':'password'}
                    value={form.password}
                    variant="standard"
                    slotProps={{input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button color="primary" onClick={handleClickShowPassword}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </Button>
                            </InputAdornment>
                        ),
                    }}}
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

interface Props {
    user: IUser;
}
interface State {
    show: boolean;
    showPassword: boolean;
    errors: any;
    form: any;
}