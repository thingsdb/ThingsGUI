import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import {ErrorMsg} from '../Util';
import {ApplicationStore, ApplicationActions} from '../../Stores';
import {AuthTAG} from '../../constants';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['authMethod']
}]);

const tag = AuthTAG;

const Auth = ({authMethod}) => {
    const [show, setShow] = React.useState(false);
    const [loginWith, setLoginWith] = React.useState(authMethod||'pass');
    const [form, setForm] = React.useState({
        token: '',
        user: '',
        pass: ''
    });

    const handleChangeForm = ({target}) => {
        const {id, value} = target;
        setForm(form => ({...form, [id]: value}));
    };

    const handleClickShow = () => {
        setShow(!show);
    };

    const handleLoginWith = ({target}) => {
        const {value} = target;
        setLoginWith(value);
    };

    const handleClickOk = () => {
        if(loginWith === 'token') {
            ApplicationActions.authToken(form.token, tag);
        } else if (loginWith === 'pass') {
            ApplicationActions.authPass(form.user, form.pass, tag);
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    return (
        <Dialog
            open
            onClose={() => null}
            aria-labelledby="form-dialog-title"
            fullWidth
            maxWidth="xs"
            onKeyPress={handleKeyPress}
        >
            <DialogTitle id="form-dialog-title">
                {'Login'}
            </DialogTitle>
            <DialogContent>
                <ErrorMsg tag={tag} />
                <Collapse in={authMethod===''} timeout="auto" unmountOnExit>
                    <FormControl margin="none" size="small" fullWidth>
                        <RadioGroup aria-label="position" name="position" value={loginWith} onChange={handleLoginWith} row>
                            <FormControlLabel
                                value="pass"
                                control={<Radio color="primary" />}
                                label="with password"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="token"
                                control={<Radio color="primary" />}
                                label="with token"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                </Collapse>
                <Collapse in={loginWith === 'pass'} timeout="auto" unmountOnExit>
                    <TextField
                        margin="dense"
                        id="user"
                        label="User"
                        type="text"
                        value={form.user}
                        spellCheck={false}
                        onChange={handleChangeForm}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="pass"
                        label="Password"
                        type={show?'text':'password'}
                        value={form.pass}
                        spellCheck={false}
                        onChange={handleChangeForm}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShow}>
                                        {show ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Collapse>
                <Collapse in={loginWith === 'token'} timeout="auto" unmountOnExit>
                    <TextField
                        margin="dense"
                        id="token"
                        label="Token"
                        type={show?'text':'password'}
                        value={form.token}
                        spellCheck={false}
                        onChange={handleChangeForm}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShow}>
                                        {show ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Collapse>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOk} color="primary">
                    {'Connect'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

Auth.propTypes = {
    authMethod: ApplicationStore.types.authMethod.isRequired,
};

export default withStores(Auth);