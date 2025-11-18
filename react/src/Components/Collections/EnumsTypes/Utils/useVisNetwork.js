import React from 'react';
import PropTypes from 'prop-types';
import { Network } from 'vis-network/standalone';


const useVisNetwork = ({
    edges = [],
    nodes = [],
    options = {},
}) => {
    const [network, setNetwork] = React.useState(null);
    const ref = React.useRef(null);

    React.useLayoutEffect(() => {
        if (ref.current) {
            const instance = new Network(ref.current, { nodes, edges }, options);
            setNetwork(instance);
        }
        return () => network?.destroy();
    }, []); // eslint-disable-line

    return {
        network,
        ref
    };
};

useVisNetwork.propTypes = {
    edges: PropTypes.arrayOf(PropTypes.object),
    nodes: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
};

export default useVisNetwork;
