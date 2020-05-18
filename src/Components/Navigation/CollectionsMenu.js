import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import {withVlow} from 'vlow';

import {Add} from '../Collections/Config';
import {Menu} from '../Util';
import {ApplicationActions, ThingsdbActions, ThingsdbStore} from '../../Stores';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const CollectionsMenu = ({collections}) => {

    React.useEffect(() => {
        ThingsdbActions.getCollections();
    }, []);

    const handleRefresh = () => {
        ThingsdbActions.getCollections();
    };

    const handleClickCollection = (collection) => {
        ApplicationActions.navigate({path: 'collection', index: collection, item: '', scope:''});
    };

    return (
        <Menu
            title="collections"
            icon={<DashboardIcon color="primary" />}
            items={collections}
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
