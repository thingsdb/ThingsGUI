/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';

import NodeButtons from '../Nodes/NodeButtons';
import Node from './Node';
import ReplaceNode from './ReplaceNode';
import {TableWithRowExtend} from '../Util';

const Nodes = ({nodes}) => {


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
    const handleButtons = (node) => <ReplaceNode node={node} />;
    return(
        <React.Fragment>
            <TableWithRowExtend buttons={handleButtons} header={header} rows={rows} rowExtend={rowExtend} />
            <NodeButtons />
        </React.Fragment>
    );
};

Nodes.propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Nodes;
