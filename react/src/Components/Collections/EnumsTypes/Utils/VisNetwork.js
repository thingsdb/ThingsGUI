import React from 'react';
import PropTypes from 'prop-types';

import useVisNetwork from './useVisNetwork';


const VisNetwork = ({ edges, nodes, options }) => {
    const { ref, network } = useVisNetwork({
        edges,
        nodes,
        options,
    });

    return (
        <div
            ref={ref}
            style={{
                width: '1000px',
                height: '1000px'
            }}
        />
    );
};

VisNetwork.defaultProps = {
    edges: [],
    nodes: [],
    options: {},
};

VisNetwork.propTypes = {
    edges: PropTypes.arrayOf(PropTypes.object),
    nodes: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
};

export default VisNetwork;