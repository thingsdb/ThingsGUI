import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';

import {NodesActions, NodesStore} from '../../../Stores';
import { SimpleModal, StartStopPolling } from '../../Util';
import NodeGraph from './NodeGraph';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['streamInfo']
}]);

const useStyles = makeStyles(() => ({
    graph: {
        backgroundColor: '#000',
        height: 600
    },
}));

const OpenNodeGraph = ({nodes, streamInfo}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleLoading = React.useCallback(() => {
        setTimeout(()=> {
            setLoading(false);
        }, 1000);
    }, []);

    React.useEffect(() => {
        if (open) {
            setLoading(true);
            NodesActions.getStreamInfo(handleLoading);
        }
    }, [handleLoading, open]);

    const handleRefresh = () => {
        setLoading(true);
        NodesActions.getStreamInfo(handleLoading);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickClose = () => {
        setOpen(false);
    };

    return(
        <SimpleModal
            actionButtons={
                <React.Fragment>
                    <Tooltip disableFocusListener disableTouchListener title="Refresh stream info">
                        <Button color="primary" onClick={handleRefresh} >
                            <RefreshIcon color="primary" />
                        </Button>
                    </Tooltip>
                    <StartStopPolling onPoll={handleRefresh} title="stream info" />
                </React.Fragment>
            }
            button={
                <Tooltip disableFocusListener disableTouchListener title={Object.keys(streamInfo).length ? 'Ready' : 'Getting stream data...'} >
                    <span>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen} >
                            {'View stream graph'}
                        </Button>
                    </span>
                </Tooltip>
            }
            title="Nodes and stream data"
            open={open}
            onClose={handleClickClose}
            maxWidth="md"
        >
            <Grid className={classes.graph} container justify="center" alignItems="center">
                <Grid item>
                    {loading ? <CircularProgress />
                        : (
                            <Fade>
                                <NodeGraph data={nodes} streamInfo={streamInfo} />
                            </Fade>
                        )}
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

OpenNodeGraph.propTypes = {
    /* collections properties */
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,

    /* nodes properties */
    streamInfo: NodesStore.types.streamInfo.isRequired,
};

export default withStores(OpenNodeGraph);