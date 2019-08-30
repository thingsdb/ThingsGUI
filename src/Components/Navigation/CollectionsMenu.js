import React from 'react';
import { useGlobal } from 'reactn'; // <-- reactn
import DashboardIcon from '@material-ui/icons/Dashboard';
import PropTypes from 'prop-types';

import AddCollection from '../Collections/Add';
import {Menu} from '../Util';
import ApplicationActions from '../../Actions/ApplicationActions';



const CollectionsMenu = ({onClickCollection}) => {
    const collections = useGlobal('collections')[0];

    const handleClickCollection = (collection) => {
        onClickCollection(collection);
        ApplicationActions.navigate({path: 'collection'});
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
