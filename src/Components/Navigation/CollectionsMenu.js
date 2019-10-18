import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import {withVlow} from 'vlow';

import AddCollection from '../Collections/Add';
import {Menu} from '../Util';
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';


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
        ApplicationActions.navigate({path: 'collection', index: collection, item: ''});
    };

    return (
        <Menu
            title="COLLECTIONS"
            icon={<DashboardIcon />}
            items={collections}
            addItem={<AddCollection />}
            onClickItem={handleClickCollection}
        />
    );
};

CollectionsMenu.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(CollectionsMenu);
