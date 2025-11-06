import { amber } from '@mui/material/colors';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {ErrorMsg, SimpleModal, TwoLabelSwitch} from '../../Utils';
import {ApplicationActions, NodesActions} from '../../../Stores';
import {RestoreNodeTAG} from '../../../Constants/Tags';


const initialState = {
    show: false,
    showRedirectModal: false,
    fileName: '',
    takeAccess: false,
    restoreTasks: false,
};

const tag = RestoreNodeTAG;

const nodeNotReady = (nodes) => {
    if(nodes.length>1){
        return Boolean(nodes.find((n)=>n.status!=='READY'&&n.committed_event_id!==n.stored_event_id));
    }
    return false;
};

const Restore = ({nodes}: Props) => {
    const [state, setState] = React.useState(initialState);
    const {show, fileName, takeAccess, restoreTasks, showRedirectModal} = state;

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

    const handleRestoreTasks = ({target}) => {
        const {checked} = target;
        setState({...state, restoreTasks: checked});
    };

    const handleClickOk = () => {
        NodesActions.restore(
            fileName,
            takeAccess,
            restoreTasks,
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
                    autoFocus
                    fullWidth
                    helperText="Note: file should exist on node server"
                    id="fileName"
                    label="File name"
                    name="fileName"
                    onChange={handleFileName}
                    type="text"
                    value={fileName}
                    variant="standard"
                    slotProps={{formHelperText: {
                        style: {
                            marginBottom: '16px',
                            color: amber[700]
                        }
                    }}}
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
                <Typography component="div" variant="caption">
                    <FormLabel component="label">
                        {'Keep your tasks?'}
                    </FormLabel>
                    <TwoLabelSwitch
                        input={restoreTasks}
                        labelOne="no"
                        labelTwo="yes"
                        onChange={handleRestoreTasks}
                    />
                    <FormHelperText sx={{color: amber[700]}}>
                        {'It is not possible to keep both your access rights and tasks.'}
                    </FormHelperText>
                </Typography>
            </SimpleModal>
            <SimpleModal
                title="Restore"
                open={showRedirectModal}
            >
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Typography variant="body2">
                            {'ThingsDB has been successfully restored. You need to login again. After you clicked "OK" you are redirected to the login screen.'}
                        </Typography>
                    </Grid>
                    <Grid container justifyContent="center" size={12}>
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

interface Props {
    nodes: INode[];
}