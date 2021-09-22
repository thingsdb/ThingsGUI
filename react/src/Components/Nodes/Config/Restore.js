import { amber } from '@mui/material/colors';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {ErrorMsg, SimpleModal, TwoLabelSwitch} from '../../Util';
import {ApplicationActions, NodesActions} from '../../../Stores';
import {RestoreNodeTAG} from '../../../Constants/Tags';


const initialState = {
    show: false,
    showRedirectModal: false,
    fileName: '',
    takeAccess: false,
};

const tag = RestoreNodeTAG;

const nodeNotReady = (nodes) => {
    if(nodes.length>1){
        return Boolean(nodes.find((n)=>n.status!=='READY'&&n.committed_event_id!==n.stored_event_id));
    }
    return false;
};

const Restore = ({nodes}) => {
    const [state, setState] = React.useState(initialState);
    const {show, fileName, takeAccess, showRedirectModal} = state;

    React.useEffect(()=>{
        let id;
        if(show){
            id = setInterval(() => NodesActions.getNodes(), 2000);
        }
        return () => clearInterval(id);
    }, [show]);

    const handleClickOpen = () => {
        setState({...initialState, show: true});
    };

    const handleOpenRedirectModal = () => {
        setState({...initialState, showRedirectModal: true});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };


    const handleFileName = ({target}) => {
        const {value} = target;
        setState({...state, fileName: value});
    };

    const handleTakeAccess = ({target}) => {
        const {checked} = target;
        setState({...state, takeAccess: checked});
    };


    const handleClickOk = () => {
        NodesActions.restore(
            fileName,
            takeAccess,
            tag,
            () => {
                handleClickClose();
                handleOpenRedirectModal();
            }
        );
    };

    const handleClickRedirect = () => {
        ApplicationActions.disconnect();
    };

    const notReady = nodeNotReady(nodes);

    return(
        <React.Fragment>
            <SimpleModal
                button={
                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                        {'Restore'}
                    </Button>
                }
                title="Restore"
                open={show}
                onOk={handleClickOk}
                onClose={handleClickClose}
                disableOk={notReady}
                tooltipMsgOk={notReady?'The nodes are busy at the moment, please wait...':''}
            >
                <ErrorMsg tag={tag} />
                <TextField
                    id="fileName"
                    type="text"
                    name="fileName"
                    label="File name"
                    onChange={handleFileName}
                    value={fileName}
                    variant="standard"
                    fullWidth
                    helperText="Note: file should exist on node server"
                    FormHelperTextProps={{
                        style: {
                            marginBottom: '16px',
                            color: amber[700]
                        }
                    }}
                />

                <Typography component="div" variant="caption">
                    <FormLabel component="label">
                        {'Keep your access rights?'}
                    </FormLabel>
                    <TwoLabelSwitch
                        input={takeAccess}
                        labelOne="no"
                        labelTwo="yes"
                        onChange={handleTakeAccess}
                    />
                </Typography>
            </SimpleModal>
            <SimpleModal
                title="Restore"
                open={showRedirectModal}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            {'ThingsDB has been successfully restored. You need to login again. After you clicked "OK" you are redirected to the login screen.'}
                        </Typography>
                    </Grid>
                    <Grid container justifyContent="center" item xs={12}>
                        <Button variant="outlined" color="primary" onClick={handleClickRedirect}>
                            {'OK'}
                        </Button>
                    </Grid>
                </Grid>
            </SimpleModal>
        </React.Fragment>
    );
};

Restore.propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Restore;