import React from 'react';
import {withVlow} from 'vlow';

import {NodesActions, NodesStore} from '../../Stores';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['connectedNode']
}]);

const HeaderTitle = ({connectedNode}: INodesStore) => {
    React.useEffect(() => {
        NodesActions.getConnectedNode();
    }, []);

    return(
        // (https://react.dev/reference/react-dom/components/title)
        // React will always place the corresponding DOM element in the document head.
        <title>
            {`ThingsGUI ${connectedNode&&connectedNode.node_name ? `  -  ${connectedNode.node_name}:${connectedNode.client_port}`: ''}`}
        </title>
    );
};

HeaderTitle.propTypes = {
    connectedNode: NodesStore.types.connectedNode.isRequired,
};

export default withStores(HeaderTitle);