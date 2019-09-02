/* eslint-disable react/no-multi-comp */
import React from 'react';
import NodeButtons from '../Nodes/NodeButtons';
import Node from './Node';
import {TableWithRowExtend} from '../Util';
import {useStore} from '../../Actions/ApplicationActions';

const Nodes = () => {
    const store = useStore()[0];
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
    const rowExtend = (node) => <Node local={node} />;

    return(
        <React.Fragment>
            <TableWithRowExtend header={header} rows={rows} rowExtend={rowExtend} />
            <NodeButtons />
        </React.Fragment>
    );
};

export default Nodes;
