import Collapse from '@mui/material/Collapse';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const Edit = ({credentials, form, security, onChange, editField}) => {
    const [show, setShow] = React.useState(false);
    const [loginWith, setLoginWith] = React.useState(credentials.isToken? 'token':'pass');
    const [clickAwayActive, setClickAwayActive] = React.useState(false);

    const showAll = editField==='all';
    const showAddress = editField==='address';
    const showCred = editField==='credentials';
    const showName = editField==='name';
    const showSecurity = editField==='security';
    const showToken = loginWith=='token';
    const showUserPass = loginWith=='pass';

    const handleOnChangeCredentials = ({target}) => {
        const {id, value} = target;
        onChange('credentials', {[id]: value});
    };

    const handleOnChangeName = ({target}) => {
        const {value} = target;
        onChange('form', {name: value});
    };

    const handleOnChangeAddress = ({target}) => {
        const {value} = target;
        setClickAwayActive(true);
        onChange('form', {address: value});
    };

    const handleClickAwayCheck = () => {
        if(showAll){
            setClickAwayActive(false);
            const tls = form.address.startsWith('https://');
            onChange('security', {secureConnection: tls, insecureSkipVerify: false});
        }
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
        const {checked} = target;
        onChange('security', {secureConnection: checked, insecureSkipVerify: false});
    };

    const handleSwitchISV = ({target}) => {
        const {checked} = target;
        onChange('security', {insecureSkipVerify: checked});
    };

    return (
        <React.Fragment>
            <Collapse in={showName} timeout="auto" unmountOnExit>
                <TextField
                    autoFocus
                    disabled={!showName}
                    fullWidth
                    id="name"
                    label="Name"
                    margin="dense"
                    onChange={handleOnChangeName}
                    spellCheck={false}
                    type="text"
                    value={form.name}
                    variant="standard"
                />
            </Collapse>
            <Collapse in={showAll||showAddress} timeout="auto" unmountOnExit>
                <ClickAwayListener onClickAway={handleClickAwayCheck} touchEvent={clickAwayActive && 'onTouchEnd'} mouseEvent={clickAwayActive && 'onClick'}>
                    <TextField
                        autoFocus
                        fullWidth
                        id="address"
                        label="Socket Address"
                        margin="dense"
                        onChange={handleOnChangeAddress}
                        spellCheck={false}
                        type="text"
                        value={form.address}
                        variant="standard"
                    />
                </ClickAwayListener>
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
                        fullWidth
                        id="user"
                        label="User"
                        margin="dense"
                        onChange={handleOnChangeCredentials}
                        spellCheck={false}
                        type="text"
                        value={credentials.user}
                        variant="standard"
                    />
                    <TextField
                        fullWidth
                        id="password"
                        label="Password"
                        margin="dense"
                        onChange={handleOnChangeCredentials}
                        spellCheck={false}
                        type={show?'text':'password'}
                        value={credentials.password}
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button color="primary" onClick={handleClickShow}>
                                        {show ? <Visibility /> : <VisibilityOff />}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Collapse>
                <Collapse in={showToken} timeout="auto" unmountOnExit>
                    <TextField
                        fullWidth
                        id="token"
                        label="Token"
                        margin="dense"
                        onChange={handleOnChangeCredentials}
                        spellCheck={false}
                        type={show?'text':'password'}
                        value={credentials.token}
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button color="primary" onClick={handleClickShow}>
                                        {show ? <Visibility /> : <VisibilityOff />}
                                    </Button>
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
                                onChange={handleSwitchISV}
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