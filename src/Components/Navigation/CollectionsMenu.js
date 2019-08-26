import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PropTypes from 'prop-types';

import AddCollection from '../Collections/Add';
import {Menu} from '../Util';
import {ApplicationActions} from '../../Stores/ApplicationStore';


const CollectionsMenu = ({collections, onClickCollection}) => {

    const handleClickCollection = (collection) => {
        onClickCollection(collection);
        ApplicationActions.navigate({path: 'collection'});
    }

    return (
        <Menu
            title={'COLLECTIONS'}
            icon={<DashboardIcon />}
            items={collections}
            addItem={<AddCollection />}
            onClickItem={handleClickCollection}
        />
    );
};

CollectionsMenu.propTypes = {
    onClickCollection: PropTypes.func.isRequired,
    collections: PropTypes.array.isRequired,

};

export default CollectionsMenu;
