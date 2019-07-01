/* eslint-disable react/no-multi-comp */
import React from 'react';

import Node from './Node';
import Tabel from '../Util/Table2';
import {useStore} from '../../Stores/NodesStore';


const Nodes = () => {
    const [store] = useStore();
    const {nodes} = store;

    const rows = nodes;
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
            <Tabel header={header} rows={rows} rowExtend={rowExtend} />
        </React.Fragment>
    );
};

export default Nodes;