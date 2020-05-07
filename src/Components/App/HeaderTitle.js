import React from 'react';
import {withVlow} from 'vlow';
import { Helmet } from 'react-helmet';

import {NodesActions, NodesStore} from '../../Stores';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['connectedNode']
}]);

const HeaderTitle = ({connectedNode}) => {
    React.useEffect(() => {
        NodesActions.getConnectedNode();
    },
    [],
    );

    return(
        <Helmet>
            <title>
                {`ThingsGUI ${connectedNode&&connectedNode.node_name ? `  -  ${connectedNode.node_name}:${connectedNode.client_port}`: ''}`}
            </title>
        </Helmet>
    );
};

HeaderTitle.propTypes = {
    connectedNode: NodesStore.types.connectedNode.isRequired,
};

export default withStores(HeaderTitle);