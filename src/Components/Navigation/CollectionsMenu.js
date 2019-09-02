import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PropTypes from 'prop-types';

import AddCollection from '../Collections/Add';
import {Menu} from '../Util';
import { ApplicationActions, useStore } from '../../Actions/ApplicationActions';



const CollectionsMenu = ({onClickCollection}) => {
    const [store, dispatch] = useStore();
    const {collections} = store;

    const handleClickCollection = (collection) => {
        onClickCollection(collection);
        ApplicationActions.navigate(dispatch, {path: 'collection'});
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
    onClickCollection: PropTypes.func.isRequired,
};

export default CollectionsMenu;
