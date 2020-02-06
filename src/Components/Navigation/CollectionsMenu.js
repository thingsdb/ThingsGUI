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
        const setPoll = setInterval(
            () => {
                ThingsdbActions.getCollections();
            }, 5000);
        return () => {
            clearInterval(setPoll);
        };
    }, []);

    const handleClickCollection = (collection) => {
        ApplicationActions.navigate({path: 'collection', index: collection, item: '', scope:''});
    };

    return (
        <Menu
            title="COLLECTIONS"
            icon={<DashboardIcon color="primary" />}
            items={collections}
            addItem={<Add />}
            onClickItem={handleClickCollection}
        />
    );
};

CollectionsMenu.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(CollectionsMenu);
