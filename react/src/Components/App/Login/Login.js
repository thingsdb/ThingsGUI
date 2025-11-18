import {withVlow} from 'vlow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import React from 'react';

import { ErrorMsg, isObjectEmpty, SimpleModal, SearchInput } from '../../Utils';
import {ApplicationStore, ApplicationActions} from '../../../Stores';
import {LoginTAG, LoginEditTAG} from '../../../Constants/Tags';
import Edit from './Edit';
import ListConnections from './ListConnections';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['cachedConnections']
}]);

const tag = LoginTAG;

const Login = ({cachedConnections}) => {
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
            isToken: false,
        },
        security: {
            insecureSkipVerify: false,
            secureConnection: false,
        },
        oldName: '',
        showNewConn: isObjectEmpty(cachedConnections),
        openSaveConn: false,
        editField: 'all',
    };
    const [search, setSearch] = React.useState('');
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
            oldName ? ApplicationActions.renameCachedConn({...form, ...credentials, ...security}, oldName, LoginEditTAG, handleClickCloseSaveConn)
                : ApplicationActions.newCachedConn({...form, ...credentials, ...security}, LoginEditTAG, handleClickCloseSaveConn);
            break;
        case 'credentials':
            ApplicationActions.editCachedConn({name: form.name, ...credentials}, LoginEditTAG, handleClickCloseSaveConn);
            break;
        case 'security':
            ApplicationActions.editCachedConn({name: form.name, ...security}, LoginEditTAG, handleClickCloseSaveConn);
            break;
        case 'address':
            ApplicationActions.editCachedConn(form, LoginEditTAG, handleClickCloseSaveConn);
            break;
        }
    };

    const handleClickBack = () => {
        setState({...state, showNewConn: false});
    };

    const handleClickOk = () => {
        ApplicationActions.connectToNew({...form, ...credentials, ...security}, tag);
    };

    const handleEditConn = (ky, val) => {
        setState(prevState => {
            const updatedCred = {
                password: '',
                token: '',
                user: val.user,
                isToken: val.isToken,
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
                <ErrorMsg tag={LoginEditTAG} />
                <Edit form={form} credentials={credentials} security={security} onChange={handleOnChange} editField={editField} />
            </SimpleModal>
            <Dialog
                open
                onClose={() => null}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title" sx={{display: 'flex'}}>
                    <Box flexGrow={1}>
                        {'Login'}
                    </Box>
                    <SearchInput
                        onChange={({target}) => setSearch(target.value)}
                        value={search}
                        autoFocus
                    />
                </DialogTitle>
                <DialogContent>
                    <ErrorMsg tag={tag} />
                    <Collapse in={!showNewConn} timeout="auto" unmountOnExit>
                        <ListConnections onClickNewConn={handleNewConn} onEdit={handleEditConn} search={search} />
                    </Collapse>
                    <Collapse in={showNewConn} timeout="auto" unmountOnExit>
                        <Edit form={form} credentials={credentials} security={security} onChange={handleOnChange} />
                    </Collapse>
                </DialogContent>
                <Collapse in={showNewConn} timeout="auto" unmountOnExit>
                    <DialogActions>
                        <Grid container>
                            <Grid size={6} container justifyContent="flex-start" >
                                <Collapse in={Boolean(cachedConnections&&Object.keys(cachedConnections).length)} timeout="auto" unmountOnExit>
                                    <Grid size={3}>
                                        <Button onClick={handleClickBack} color="primary">
                                            {'Connections'}
                                        </Button>
                                    </Grid>
                                </Collapse>
                                <Grid size={3}>
                                    <Button onClick={handleClickOpenSaveConn} color="primary">
                                        {'Save'}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid size={6} container justifyContent="flex-end">
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
    cachedConnections: ApplicationStore.types.cachedConnections.isRequired,
};

export default withStores(Login);