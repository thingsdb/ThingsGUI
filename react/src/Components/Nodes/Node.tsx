import PropTypes from 'prop-types';
import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import {Backup} from './Backup';
import {Counters} from './Counters';
import {NodeConfig} from './Config';
import {Modules} from './Modules';
import {NodesActions} from '../../Stores';


const Node = ({selectedNode}) => {
    const [tabIndex, setTabIndex] = React.useState(0);

    React.useEffect(() => {
        NodesActions.getNode(selectedNode.node_id); // update of the selected node; to get the latest info
        NodesActions.getCounters(selectedNode.node_id); // update of the selected node counters; to get the latest info
        NodesActions.getBackups(selectedNode.node_id);
        NodesActions.getModules(selectedNode.node_id);
    }, [selectedNode.node_id]);

    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);

        switch(newValue){
        case 0:
            NodesActions.getNode(selectedNode.node_id); // update of the selected node; to get the latest info
            break;
        case 1:
            NodesActions.getCounters(selectedNode.node_id); // update of the selected node counters; to get the latest info
            break;
        case 2:
            NodesActions.getBackups(selectedNode.node_id);
            break;
        case 3:
            NodesActions.getModules(selectedNode.node_id);
            break;
        }
    };

    const offline = selectedNode.status == 'OFFLINE';

    return selectedNode ? (
        <React.Fragment>
            <Tabs value={tabIndex} onChange={handleChangeTab} indicatorColor="primary" aria-label="styled tabs example">
                <Tab label="Node Info" />
                <Tab label="Counters" />
                <Tab label="Backup" />
                <Tab label="Modules" />
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
            {tabIndex === 3 &&
                <Modules nodeId={selectedNode.node_id} offline={offline} />
            }
        </React.Fragment>
    ) : null;
};

Node.propTypes = {
    selectedNode: PropTypes.object.isRequired,
};

export default Node;