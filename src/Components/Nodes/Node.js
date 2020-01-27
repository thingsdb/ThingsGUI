import PropTypes from 'prop-types';
import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import {Backup} from './Backup';
import {Counters} from './Counters';
import {NodeConfig} from './Config';
import {NodesActions} from '../../Stores';


const Node = ({selectedNode}) => {
    const [tabIndex, setTabIndex] = React.useState(0);

    React.useEffect(() => {
        switch(tabIndex){
        case 0:
            NodesActions.getNode(selectedNode.node_id); // update of the selected node; to get the latest info
            break;
        case 1:
            NodesActions.getCounters(selectedNode.node_id); // update of the selected node; to get the latest info
            break;
        case 2:
            NodesActions.getBackups(selectedNode.node_id);
            break;
        }
    }, [tabIndex]);

    React.useEffect(() => {
        NodesActions.getNode(selectedNode.node_id); // update of the selected node; to get the latest info
        NodesActions.getCounters(selectedNode.node_id); // update of the selected node; to get the latest info
        NodesActions.getBackups(selectedNode.node_id);
    }, [selectedNode.node_id]);

    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);
    };

    const offline = selectedNode.status == 'OFFLINE';

    console.log('node');

    return selectedNode ? (
        <React.Fragment>
            <Tabs value={tabIndex} onChange={handleChangeTab} indicatorColor="primary" aria-label="styled tabs example">
                <Tab label="Node Info" />
                <Tab label="Counters" />
                <Tab label="Backup" />
            </Tabs>
            {tabIndex === 0 &&
                <NodeConfig nodeId={selectedNode.node_id} offline={offline} />
            }
            {tabIndex === 1 &&
                <Counters nodeId={selectedNode.node_id} offline={offline} />
            }
            {tabIndex === 2 &&
                <Backup nodeId={selectedNode.node_id} offline={offline} />
            }
        </React.Fragment>
    ) : null;
};

Node.propTypes = {
    selectedNode: PropTypes.object.isRequired,
};

export default Node;