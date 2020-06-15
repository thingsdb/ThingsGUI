import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import { ErrorMsg, isObjectEmpty, SimpleModal } from '../../Util';
import {ApplicationStore, ApplicationActions} from '../../../Stores';
import {LoginTAG} from '../../../constants';
import Edit from './Edit';
import ListConnections from './ListConnections';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['loaded', 'connected', 'savedConnections']
}]);

const tag = LoginTAG;

const Login = ({connected, loaded, savedConnections}) => {
    const initialState = {
        form: {
            address: 'localhost:9200',
            name: '',
            memo: '',
        },
        credentials: {
            password: '',
            token: '',
            user: '',
        },
        security: {
            insecureSkipVerify: false,
            secureConnection: false,
        },
        oldName: '',
        showNewConn: isObjectEmpty(savedConnections),
        openSaveConn: false,
        editField: 'all',
    };
    const [state, setState] = React.useState(initialState);
    const {credentials, editField, form, security, oldName, openSaveConn, showNewConn} = state;

    const handleNewConn = () => {
        setState({
            ...initialState,
            showNewConn: true,
        });
    };

    const handleOnChange = (ky, obj) => {
        setState(prevState => {
            const update = {...prevState[ky], ...obj};
            return {...prevState, [ky]: update};
        });
    };

    const handleClickOpenSaveConn = () => {
        setState({...state, openSaveConn: true, editField: 'name'});
    };

    const handleClickCloseSaveConn = () => {
        setState({...state, openSaveConn: false});
    };

    const handleClickSave = () => {
        switch(editField){
        case 'name':
            const obj = {...form, ...credentials, ...security};
            oldName ? ApplicationActions.renameConn(obj, oldName, tag, handleClickCloseSaveConn)
                : ApplicationActions.newConn(obj, tag, handleClickCloseSaveConn);
            break;
        case 'credentials':
            ApplicationActions.editConn({name: form.name, ...credentials}, tag, handleClickCloseSaveConn);
            break;
        case 'security':
            ApplicationActions.editConn({name: form.name, ...security}, tag, handleClickCloseSaveConn);
            break;
        case 'address':
            ApplicationActions.editConn(form, tag, handleClickCloseSaveConn);
            break;
        }
    };

    const handleClickBack = () => {
        setState({...state, showNewConn: false});
    };

    const handleClickOk = () => {
        ApplicationActions.connect({...form, ...credentials, ...security}, tag);
    };

    const handleEditConn = (ky, val) => {
        setState(prevState => {
            const updatedCred = {
                password: val.password,
                token: val.token,
                user: val.user
            };
            const updatedForm = {
                address: val.address,
                name: val.name,
                memo: val.memo
            };
            const updatedSecurity = {
                insecureSkipVerify: val.insecureSkipVerify,
                secureConnection: val.secureConnection
            };
            return {...prevState, openSaveConn: true, editField: ky, credentials: updatedCred, form: updatedForm, oldName: ky=='name'?val.name:'', security: updatedSecurity};
        });
    };


    return (
        <React.Fragment>
            <SimpleModal
                title={`${editField==='name'?'Save':'Edit'} connection configuration`}
                onOk={handleClickSave}
                open={openSaveConn}
                onClose={handleClickCloseSaveConn}
            >
                <Edit form={form} credentials={credentials} security={security} onChange={handleOnChange} editField={editField} />
            </SimpleModal>
            <Dialog
                open={loaded && !connected}
                onClose={() => null}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
                // onKeyDown={handleKeyPress}
            >
                <DialogTitle id="form-dialog-title">
                    {'Login'}
                </DialogTitle>
                <DialogContent>
                    <ErrorMsg tag={tag} />
                    <Collapse in={!showNewConn} timeout="auto" unmountOnExit>
                        <ListConnections onClickNewConn={handleNewConn} onEdit={handleEditConn} />
                    </Collapse>
                    <Collapse in={showNewConn} timeout="auto" unmountOnExit>
                        <Edit form={form} credentials={credentials} security={security} onChange={handleOnChange} />
                    </Collapse>
                </DialogContent>
                <Collapse in={showNewConn} timeout="auto" unmountOnExit>
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
                                    <Button onClick={handleClickOpenSaveConn} color="primary">
                                        {'Save'}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} container justify="flex-end">
                                <Button onClick={handleClickOk} color="primary">
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