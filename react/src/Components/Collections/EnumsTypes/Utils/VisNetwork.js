import React from 'react';
import PropTypes from 'prop-types';

import useVisNetwork from './useVisNetwork';


const VisNetwork = ({
    edges = [],
    nodeId = '',
    nodes = [],
    options = {},
    fullScreen = false,
}) => {
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
                height: fullScreen ? '100%' : '700px'
            }}
        />
    );
};

VisNetwork.propTypes = {
    edges: PropTypes.arrayOf(PropTypes.object),
    nodeId: PropTypes.string,
    nodes: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
    fullScreen: PropTypes.bool,
};

export default VisNetwork;