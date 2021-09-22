import React from 'react';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {withVlow} from 'vlow';

import {Add} from '../Collections/Config';
import {COLLECTION_ROUTE} from '../../Constants/Routes';
import {Menu, orderByName} from '../Util';
import {ThingsdbActions, ThingsdbStore} from '../../Stores';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const CollectionsMenu = ({collections}) => {

    const handleRefresh = () => {
        ThingsdbActions.getCollections();
    };

    const orderedCollections = orderByName(collections||[]);

    return (
        <Menu
            title="collections"
            icon={<LibraryBooksIcon color="primary" />}
            itemKey="name"
            items={orderedCollections}
            addItem={<Add />}
            onRefresh={handleRefresh}
            homeRoute={COLLECTION_ROUTE}
        />
    );
};

CollectionsMenu.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(CollectionsMenu);
