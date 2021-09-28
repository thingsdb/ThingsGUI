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
    const [open, setOpen] = React.useState(false);

    const handleRefresh = () => {
        ThingsdbActions.getCollections();
    };

    const handleClickAdd = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const orderedCollections = orderByName(collections||[]);

    return (
        <React.Fragment>
            <Menu
                homeRoute={COLLECTION_ROUTE}
                icon={<LibraryBooksIcon color="primary" />}
                itemKey="name"
                items={orderedCollections}
                onAdd={handleClickAdd}
                onRefresh={handleRefresh}
                title="collections"
            />
            <Add open={open} onClose={handleClose} />
        </React.Fragment>
    );
};

CollectionsMenu.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(CollectionsMenu);
