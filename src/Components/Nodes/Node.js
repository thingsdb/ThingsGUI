import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import Connect from './Connect';
import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import Info from './Info';
import Shutdown from './Shutdown';
import {useNodes, NodesActions} from '../../Stores/NodesStore';


const Node = ({node}) => {
    const [store, dispatch] = useNodes();
    const fetch = React.useCallback(NodesActions.getNode(dispatch, node.node_id), [dispatch]);

    React.useEffect(() => {
        fetch();
    }, [node.node_id]);

    return store.node && store.node.node_id === node.node_id ? (
        <React.Fragment>
            {/* <Typography>
                {node.name}
            </Typography> */}


            {<Info node={store.node} />}
            <Typography variant="h6" >
                {'Counters'}
            </Typography>
            {<Counters counters={store.counters} />}

            <CountersReset node={store.node} />
            <Loglevel node={store.node} />
            <Shutdown node={store.node} />

        </React.Fragment>
    ) : store.node ? (
        <Connect node={node} />
    ) : null;
};

Node.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Node;