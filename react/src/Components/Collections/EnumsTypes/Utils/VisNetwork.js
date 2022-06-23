import React from 'react';
import PropTypes from 'prop-types';

import useVisNetwork from './useVisNetwork';


const VisNetwork = ({ edges, nodeId, nodes, options }) => {
    const { ref, network } = useVisNetwork({
        edges,
        nodes,
        options,
    });

    React.useEffect(() => {
        if (network && nodeId) {
            const position = network.getPosition(nodeId);
            network.moveTo({
                position,
                scale: 2,
                animation: true
            });
            network.selectNodes([nodeId]);
        }
    }, [network, nodeId]);

    return (
        <div
            ref={ref}
            style={{
                width: '1150px',
                height: '700px'
            }}
        />
    );
};

VisNetwork.defaultProps = {
    edges: [],
    nodeId: '',
    nodes: [],
    options: {},
};

VisNetwork.propTypes = {
    edges: PropTypes.arrayOf(PropTypes.object),
    nodeId: PropTypes.string,
    nodes: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
};

export default VisNetwork;