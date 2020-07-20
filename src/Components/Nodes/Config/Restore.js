import {withVlow} from 'vlow';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {AutoSelect, ErrorMsg, SimpleModal, TwoLabelSwitch} from '../../Util';
import {ApplicationActions, NodesActions, NodesStore} from '../../../Stores';
import {RestoreNodeTAG} from '../../../constants';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['backups']
}]);

const initialState = {
    show: false,
    showRedirectModal: false,
    fileName: '',
    takeAccess: false,
    err: false,
    nodeId: null,
};

const tag = RestoreNodeTAG;

const checkNodeStatus = (nodes) => {
    if(nodes.length>1){
        return nodes.find((n)=>n.status!=='READY'&&n.committed_event_id!==n.stored_event_id);
    }
    return false;
};

const Restore = ({backups, nodes}) => {
    const [state, setState] = React.useState(initialState);
    const {err, show, fileName, takeAccess, nodeId, showRedirectModal} = state;

    // React.useEffect(() => {
    //     if(nodeId!==null){
    //         console.log('hiii')
    //         NodesActions.getBackups(nodeId);
    //     }
    // },[nodeId]);

    const handleClickOpen = () => {
        setState({...initialState, show: true}); // using nodeName would result in error.
    };

    const handleOpenRedirectModal = () => {
        setState({...initialState, showRedirectModal: true}); // using nodeName would result in error.
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };


    const handleFileName = ({target}) => {
        const {value} = target;
        setState({...state, fileName: value});
    };

    // const handleNodeId = ({target}) => {
    //     const {value} = target;
    //     setState({...state, nodeId: value});
    // };

    // const handleFileName = (f) => {
    //     setState({...state, fileName: f});
    // };

    const handleTakeAccess = ({target}) => {
        const {checked} = target;
        setState({...state, takeAccess: checked});
    };


    const handleClickOk = () => {
        const e = Boolean(checkNodeStatus(nodes));
        setState({...state, err: e});
        if (!e) {
            NodesActions.restore(
                fileName,
                takeAccess,
                tag,
                () => {
                    handleClickClose();
                    handleOpenRedirectModal();
                }
            );
        } else {
            setTimeout(()=> setState({...state, err: e}), 1000);
        }
    };

    const handleClickRedirect = () => {
        ApplicationActions.disconnect();
    };

    // const backupFiles = backups.map(b=>b.files).flat();

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
            >
                <ErrorMsg tag={tag} />
                <List>
                    <Collapse in={err}>
                        <ListItem>
                            <Typography variant="caption" color="error">
                                {'The nodes are not ready yet, wait for 5-10 seconds to try again...'}
                            </Typography>
                        </ListItem>
                    </Collapse>
                    {/* <ListItem>
                        <TextField
                            id="nodeId"
                            type="text"
                            name="nodeId"
                            label="Select a node for backup file suggestions"
                            onChange={handleNodeId}
                            value={nodeId}
                            variant="standard"
                            select
                            SelectProps={{native: true}}
                            fullWidth
                        >
                            {(nodes.length?nodes.map(n=>n.node_id):[]).map(ni => (
                                <option key={ni} value={ni}>
                                    {`node:${ni}`}
                                </option>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <AutoSelect cb={handleFileName} dropdownItems={backupFiles} input={fileName} label="File name" />
                    </ListItem> */}
                    <ListItem>
                        <TextField
                            id="fileName"
                            type="text"
                            name="fileName"
                            label="File name"
                            onChange={handleFileName}
                            value={fileName}
                            variant="standard"
                            fullWidth
                        />
                    </ListItem>
                    <ListItem>
                        <Typography component="div" variant="caption">
                            <FormLabel component="label">
                                {'Keep your access rights?'}
                            </FormLabel>
                            <TwoLabelSwitch
                                input={takeAccess}
                                labelOne="no"
                                labelTwo="yes"
                                onCallback={handleTakeAccess}
                            />
                        </Typography>
                    </ListItem>
                </List>
            </SimpleModal>
            <SimpleModal
                title="Restore"
                open={showRedirectModal}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            {'ThingsDB has been successfully restored. After you clicked "OK" you are redirected to the Login screen.'}
                        </Typography>
                    </Grid>
                    <Grid container justify="center" item xs={12}>
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

    /* nodes properties */
    backups: NodesStore.types.backups.isRequired,
};

export default withStores(Restore);