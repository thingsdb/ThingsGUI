/* eslint-disable react/no-multi-comp */
import React from 'react';

import Node from './Node';
import Tabel from '../Util/Table2';
import {useStore} from '../../Stores/ApplicationStore';
import {useNodes, NodesActions} from '../../Stores/NodesStore';


const Nodes = () => {
    const [{match}] = useStore();
    const [{nodes}, nodesDispatch] = useNodes();

    const fetch = React.useCallback(NodesActions.nodes(nodesDispatch), [match]);
    React.useEffect(() => {
        fetch();
    }, [match]);

    const header = [{
        ky: 'address',
        label: 'Address',
    }, {
        ky: 'port',
        label: 'Port',
    }, {
        ky: 'status',
        label: 'Status',
    }];
    const rowExtend = (node) => <Node node={node} />;

    return (
        <React.Fragment>
            <Tabel header={header} rows={nodes} rowExtend={rowExtend} />
        </React.Fragment>
    );
};

export default Nodes;