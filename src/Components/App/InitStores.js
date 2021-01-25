import React from 'react';
import {withVlow} from 'vlow';

import {CollectionStore, EnumStore, ErrorStore, EventActions, EventStore, NodesStore, ThingsdbStore, TypeStore, ProcedureStore} from '../../Stores';

// separate function to prevent unnecessary rendering of <Root /> and children.
const withStores = withVlow([{
    store: CollectionStore,
}, {
    store: EnumStore,
}, {
    store: ErrorStore,
}, {
    store: EventStore,
}, {
    store: NodesStore,
}, {
    store: ThingsdbStore,
}, {
    store: TypeStore,
}, {
    store: ProcedureStore,
}]);

const InitStores = () => {
    React.useEffect(() => {
        EventActions.openEvCh();
    },[]);

    return null;
};

export default withStores(InitStores);