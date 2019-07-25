/* eslint-disable react/no-multi-comp */
import React from 'react';
import {withVlow} from 'vlow';

import AddCollection from './Add';
import CollectionExtend from './CollectionExtend';
import Table from '../Util/Table2';
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionsStore} from '../../Stores/CollectionsStore';


const withStores = withVlow([{
    store: CollectionsStore,
    keys: ['collections']
}]);

const Collections = ({collections}) => {
    
    const rows = collections;
    const header = [{
        ky: 'name',
        label: 'Collection',
    }, {
        ky: 'things',
        label: '# Things',
    }];
    const rowClick = () => {
        ApplicationActions.navigate({path: 'collection'});
    };

    const rowExtend = (collection) => <CollectionExtend collection={collection} />;
        
    return (
        <React.Fragment>
            <Table header={header} rows={rows} rowClick={rowClick} rowExtend={rowExtend} />
            <AddCollection />
        </React.Fragment>
    );
};

Collections.propTypes = {
    /* Collections properties */
    collections: CollectionsStore.types.collections.isRequired,
};

export default withStores(Collections);