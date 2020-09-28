import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const Edit = ({credentials, form, security, onChange, editField}) => {
    const [show, setShow] = React.useState(false);
    const [loginWith, setLoginWith] = React.useState(credentials.isToken? 'token':'pass');

    const handleOnChangeCredentials = ({target}) => {
        const {id, value} = target;
        onChange('credentials', {[id]: value});
    };

    const handleOnChangeForm = ({target}) => {
        const {id, value} = target;
        onChange('form', {[id]: value});
    };

    const handleClickShow = () => {
        setShow(!show);
    };

    const handleLoginWith = ({target}) => {
        const {value} = target;
        if (value=='pass') {
            onChange('credentials', {user: '', password: '', isToken: false});
        } else {
            onChange('credentials', {token: '', isToken: true});
        }
        setLoginWith(value);
    };

    const handleSwitchSSL = ({target}) => {
        const {id, checked} = target;
        onChange('security', {[id]: checked});
    };

    const showAll = editField==='all';
    const showAddress = editField==='address';
    const showCred = editField==='credentials';
    const showName = editField==='name';
    const showSecurity = editField==='security';
    const showToken = loginWith=='token';
    const showUserPass = loginWith=='pass';

    return (
        <React.Fragment>
            <Collapse in={showName} timeout="auto" unmountOnExit>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    value={form.name}
                    spellCheck={false}
                    onChange={handleOnChangeForm}
                    fullWidth
                    disabled={!showName}
                />
            </Collapse>
            <Collapse in={showAll||showAddress} timeout="auto" unmountOnExit>
                <TextField
                    autoFocus
                    margin="dense"
                    id="address"
                    label="Socket Address"
                    type="text"
                    value={form.address}
                    spellCheck={false}
                    onChange={handleOnChangeForm}
                    fullWidth
                />
            </Collapse>
            <Collapse in={showAll||showCred} timeout="auto" unmountOnExit>
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
                <Collapse in={showUserPass} timeout="auto" unmountOnExit>
                    <TextField
                        margin="dense"
                        id="user"
                        label="User"
                        type="text"
                        value={credentials.user}
                        spellCheck={false}
                        onChange={handleOnChangeCredentials}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type={show?'text':'password'}
                        value={credentials.password}
                        spellCheck={false}
                        onChange={handleOnChangeCredentials}
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
                <Collapse in={showToken} timeout="auto" unmountOnExit>
                    <TextField
                        margin="dense"
                        id="token"
                        label="Token"
                        type={show?'text':'password'}
                        value={credentials.token}
                        spellCheck={false}
                        onChange={handleOnChangeCredentials}
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
            </Collapse>
            <Collapse in={showAll||showSecurity} timeout="auto" unmountOnExit>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={security.secureConnection}
                            color="primary"
                            id="secureConnection"
                            onChange={handleSwitchSSL}
                        />
                    )}
                    label="Secure connection (TLS)"
                />
                <Collapse in={security.secureConnection} component="span" timeout="auto" unmountOnExit>
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={security.insecureSkipVerify}
                                color="primary"
                                id="insecureSkipVerify"
                                onChange={handleSwitchSSL}
                            />
                        )}
                        label="Allow insecure certificates"
                    />
                </Collapse>
            </Collapse>
        </React.Fragment>
    );
};

Edit.defaultProps = {
    editField: 'all',
};

Edit.propTypes = {
    credentials: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    security: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    editField: PropTypes.string,
};

export default Edit;