import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';

import Connect from './Connect';
import Counters from './Counters';
import CountersReset from './CountersReset';
import Loglevel from './Loglevel';
import Info from './Info';
import Zone from './Zone';
import Shutdown from './Shutdown';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import ServerError from '../Util/ServerError';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['node', 'counters']
}]);

const Node = ({nodeLocal, node, counters}) => {
    const [serverError, setServerError] = useState('');

    const fetch = React.useCallback(
        () => {
            const onError = (err) => setServerError(err);
            NodesActions.getNode(nodeLocal, onError)
        },
        [nodeLocal],
    ); 

    React.useEffect(() => {
        fetch();
    }, [nodeLocal.node_id]);

    return node && node.node_id === node.node_id ? (
        <React.Fragment>
            {/* <Typography>
                {node.name}
            </Typography> */}


            {<Info node={node} />}
            <Typography variant="h6" >
                {'Counters'}
            </Typography>
            {<Counters counters={counters} />}

            <CountersReset node={node} />
            <Loglevel node={node} />
            <Zone node={node} />
            <Shutdown node={node} />

        </React.Fragment>
    ) : node ? (
        <Connect node={node} />
    ) : null;
};

Node.propTypes = {
    node: PropTypes.object.isRequired,

    /* nodes properties */
    node: NodesStore.types.node.isRequired,
    counters: NodesStore.types.counters.isRequired,

};

export default withStores(Node);