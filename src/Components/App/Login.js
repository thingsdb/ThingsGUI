import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { ErrorMsg, SimpleModal } from '../Util';
import {ApplicationStore, ApplicationActions} from '../../Stores';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['loaded', 'connected', 'savedConnections']
}]);



const initialState = {
    errors: {},
    form: {
        address: 'localhost:9200',
        insecureSkipVerify: false,
        name: '',
        password: '',
        secureConnection: false,
        token: '',
        user: '',
    },
    loginWith: 'credentials',
    showOther: false,
    showPassword: false,
    showToken: false,
    disableName: false,
    openSaveConn: false
};

const validation = {
    name: (f) => {
        if (f.name.length==0) {
            return 'is required';
        }
        return '';
    },
    address: (f) => {
        if (f.address.length==0) {
            return 'is required';
        }
        return '';
    },
    user: (f) => {
        if (f.token.length==0 && f.user.length==0 ) {
            return 'is required';
        }
        return '';
    },
    password: (f) => {
        if (f.token.length==0 && f.password.length==0 ) {
            return 'is required';
        }
        return '';
    },
    token: (f) => {
        if (f.password.length==0 && f.token.length==0 ) {
            return 'is required';
        }
        return '';
    },
};

const tag = '0';

const Login = ({connected, loaded, savedConnections}) => {
    const [state, setState] = React.useState(initialState);
    const {showPassword, showToken, errors, loginWith, form, openSaveConn, showOther, disableName} = state;
    const [notifySaved, setNotifySaved] = React.useState(false);

    React.useEffect(() => {
        ApplicationActions.getConn(tag);
    },
    [],
    );

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = ky=='name'?false:validation[ky](form);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => Boolean(d))) {
            ApplicationActions.connect(form, tag);
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    const handleClickShowPassword = () => {
        setState({...state, showPassword: !showPassword});
    };

    const handleClickShowToken = () => {
        setState({...state, showToken: !showToken});
    };

    const handleLoginWith = ({target}) => {
        const {value} = target;
        if (value=='credentials') {
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {user: '', password: ''});
                return {...prevState, form: updatedForm, loginWith: value, errors: {}};
            });
        } else {
            setState(prevState => {
                const updatedForm = Object.assign({}, prevState.form, {token: ''});
                return {...prevState, form: updatedForm, loginWith: value, errors: {}};
            });
        }
    };

    const handleSwitchSSL = ({target}) => {
        const {id, checked} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: checked});
            return {...prevState, form: updatedForm};
        });
    };

    const handleConnectToo = (name) => () => {
        ApplicationActions.connectToo({name: name}, tag);
    };

    const handleEditConn = (c) => () => {
        const login = c.token?'token':'credentials';

        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, c);
            return {...prevState, showOther: true, disableName: true, loginWith: login, form: updatedForm};
        });
    };

    const handleDeleteConn = (name) => () => {
        ApplicationActions.delConn({name: name}, tag);
    };


    const handleOther = () => {
        setState({
            ...state,
            disableName: false,
            form: {
                address: 'localhost:9200',
                insecureSkipVerify: false,
                name: '',
                password: '',
                secureConnection: false,
                token: '',
                user: '',
            },
            showOther: true,
            showToken: false,
        });
    };

    const handleTooltip = () => {
        handleClickCloseSaveConn();
        setNotifySaved(true);
        setTimeout(()=> setNotifySaved(false), 1000);
    };

    const handleClickOpenSaveConn = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = ky=='name'?false:validation[ky](form);  return d; }, {});
        if (!Object.values(err).some(d => Boolean(d))) {
            setState({...state, openSaveConn: true});
        } else {
            setState({...state, errors: err});
        }
    };

    const handleClickCloseSaveConn = () => {
        setState({...state, openSaveConn: false});
    };

    const handleClickSave = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky](form);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => Boolean(d))) {
            ApplicationActions.newConn(form, tag, handleTooltip);
        }
    };

    const handleClickBack = () => {
        setState({...state, showOther: false});
    };

    return (
        <React.Fragment>
            <SimpleModal
                title="Save connection configuration"
                onOk={handleClickSave}
                open={openSaveConn}
                onClose={handleClickCloseSaveConn}
            >
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    value={form.name}
                    spellCheck={false}
                    onChange={handleOnChange}
                    fullWidth
                    disabled={disableName}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                />
            </SimpleModal>
            <Dialog
                open={loaded && !connected}
                onClose={() => null}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
                onKeyDown={handleKeyPress}
            >
                <DialogTitle id="form-dialog-title">
                    {'Login'}
                </DialogTitle>
                <DialogContent>
                    <ErrorMsg tag={tag} />
                    <Collapse in={!showOther} timeout="auto" unmountOnExit>
                        <List>
                            {Object.entries(savedConnections).map(([k, v]) => (
                                <ListItem key={k} button onClick={handleConnectToo(k)}>
                                    <ListItemIcon>
                                        <img
                                            alt="ThingsDB Logo"
                                            src="/img/thingsdb-logo.png"
                                            draggable='false'
                                            height="25px"
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={k} secondary={v.address} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={handleEditConn(v)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={handleDeleteConn(k)}>
                                            <DeleteIcon color="primary" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            {Object.entries(savedConnections).length==0 &&
                                <ListItem>
                                    <ListItemText secondary="No saved connections" secondaryTypographyProps={{variant: 'caption'}} />
                                </ListItem>}
                            <ListItem button onClick={handleOther}>
                                <ListItemText primary="Use another connection" />
                            </ListItem>
                        </List>
                    </Collapse>
                    <Collapse in={showOther} timeout="auto" unmountOnExit>
                        <FormControl margin="none" size="small" fullWidth>
                            <RadioGroup aria-label="position" name="position" value={loginWith} onChange={handleLoginWith} row>
                                <FormControlLabel
                                    value="credentials"
                                    control={<Radio color="primary" />}
                                    label="with credentials"
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
                        <TextField
                            autoFocus
                            margin="dense"
                            id="address"
                            label="Socket Address"
                            type="text"
                            value={form.address}
                            spellCheck={false}
                            onChange={handleOnChange}
                            fullWidth
                            error={Boolean(errors.address)}
                            helperText={errors.address}
                        />
                        <Collapse in={loginWith=='credentials'} timeout="auto" unmountOnExit>
                            <TextField
                                margin="dense"
                                id="user"
                                label="User"
                                type="text"
                                value={form.user}
                                spellCheck={false}
                                onChange={handleOnChange}
                                fullWidth
                                error={Boolean(errors.user)}
                                helperText={errors.user}
                            />
                            <TextField
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
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Collapse>
                        <Collapse in={loginWith=='token'} timeout="auto" unmountOnExit>
                            <TextField
                                margin="dense"
                                id="token"
                                label="Token"
                                type={showToken?'text':'password'}
                                value={form.token}
                                spellCheck={false}
                                onChange={handleOnChange}
                                fullWidth
                                error={Boolean(errors.token)}
                                helperText={errors.token}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowToken}>
                                                {showToken ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Collapse>
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={form.secureConnection}
                                    color="primary"
                                    id="secureConnection"
                                    onChange={handleSwitchSSL}
                                />
                            )}
                            label="Secure connection (TLS)"
                        />
                        <Collapse in={form.secureConnection} component="span" timeout="auto" unmountOnExit>
                            <FormControlLabel
                                control={(
                                    <Switch
                                        checked={form.insecureSkipVerify}
                                        color="primary"
                                        id="insecureSkipVerify"
                                        onChange={handleSwitchSSL}
                                    />
                                )}
                                label="Allow insecure certificates"
                            />
                        </Collapse>
                    </Collapse>
                </DialogContent>
                <Collapse in={showOther} timeout="auto" unmountOnExit>
                    <DialogActions>
                        <Grid container>
                            <Grid item xs={6} container justify="flex-start" >
                                <Collapse in={Boolean(savedConnections&&Object.keys(savedConnections).length)} timeout="auto" unmountOnExit>
                                    <Grid item xs={3}>
                                        <Button onClick={handleClickBack} color="primary">
                                            {'Connections'}
                                        </Button>
                                    </Grid>
                                </Collapse>
                                <Grid item xs={3}>
                                    <Tooltip open={notifySaved} disableFocusListener disableTouchListener disableHoverListener title="Saved!">
                                        <Button onClick={handleClickOpenSaveConn} color="primary" disabled={Object.values(errors).some(d => d)}>
                                            {'Save'}
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container justify="flex-end">
                                <Button onClick={handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                                    {'Connect'}
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Collapse>
            </Dialog>
        </React.Fragment>
    );
};

Login.propTypes = {
    connected: ApplicationStore.types.connected.isRequired,
    loaded: ApplicationStore.types.loaded.isRequired,
    savedConnections: ApplicationStore.types.savedConnections.isRequired,
};

export default withStores(Login);