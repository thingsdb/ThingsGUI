import {withVlow} from 'vlow';

import {CollectionStore, EnumStore, ErrorStore, EventStore, NodesStore, ThingsdbStore, TypeStore, ProcedureStore} from '../../Stores';

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
    return null;
};

export default withStores(InitStores);