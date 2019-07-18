/* eslint-disable react/no-multi-comp */
import React from 'react';

import AddCollection from './Add';
import CollectionExtend from './CollectionExtend';
import Table from '../Util/Table2';
import {useStore} from '../../Stores/ApplicationStore';
import {useCollections, CollectionsActions} from '../../Stores/CollectionsStore';


const Collections = () => {
    const [{match}, dispatch] = useStore();
    const [{collections}, collectionsDispatch] = useCollections();

    const fetch = React.useCallback(CollectionsActions.collections(collectionsDispatch), [match]);
    React.useEffect(() => {
        fetch();
    }, [match]);

    const header = [{
        ky: 'name',
        label: 'Collection',
    }, {
        ky: 'things',
        label: '# Things',
    }];
    const rowClick = (collection) => {
        dispatch(() => ({match: {path: 'collection', collection}}));
    };
    const rowExtend = (collection) => <CollectionExtend collection={collection} />;

    return (
        <React.Fragment>
            <Table header={header} rows={collections} rowClick={rowClick} rowExtend={rowExtend} />
            <AddCollection />
        </React.Fragment>
    );
};

export default Collections;