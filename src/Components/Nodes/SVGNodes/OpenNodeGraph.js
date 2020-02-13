import {withVlow} from 'vlow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import {NodesStore} from '../../../Stores';
import { SimpleModal } from '../../Util';
import NodeGraph from './NodeGraph';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['streamInfo']
}]);

const OpenNodeGraph = ({nodes, streamInfo}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickClose = () => {
        setOpen(false);
    };

    return(
        <SimpleModal
            button={
                <Tooltip disableFocusListener disableTouchListener title={Object.keys(streamInfo).length ? 'Ready' : 'Getting stream data...'} >
                    <span>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen} disabled={!Object.keys(streamInfo).length} >
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
            <Grid container justify="center">
                <Grid item>
                    <NodeGraph data={nodes} streamInfo={streamInfo} />
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