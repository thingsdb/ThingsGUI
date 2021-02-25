import React from 'react';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import {withVlow} from 'vlow';

import {Add} from '../Collections/Config';
import {Menu, orderByName} from '../Util';
import {ApplicationActions, ThingsdbActions, ThingsdbStore} from '../../Stores';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const CollectionsMenu = ({collections}) => {

    const handleRefresh = () => {
        ThingsdbActions.getCollections();
    };

    const handleClickCollection = (collection) => {
        ApplicationActions.navigate({path: 'collection', index: collection, item: '', scope:''});
    };

    const orderedCollections = orderByName(collections||[]);

    return (
        <Menu
            title="collections"
            icon={<LibraryBooksIcon color="primary" />}
            items={orderedCollections}
            addItem={<Add />}
            onClickItem={handleClickCollection}
            onRefresh={handleRefresh}
        />
    );
};

CollectionsMenu.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(CollectionsMenu);
