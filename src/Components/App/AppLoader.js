import PropTypes from 'prop-types';
import React from 'react';
import {withVlow} from 'vlow';

import {ApplicationStore} from '../../Stores/ApplicationStore.js';


const withStores = withVlow({
    store: ApplicationStore,
    keys: ['loaded']
});

const AppLoader = ({loaded}) => {
    if (!loaded) {
        return (
            <div>
                {'Loading...'}
            </div>
        );
    }
    return null;
};

AppLoader.propTypes = {
    loaded: PropTypes.bool.isRequired,
};

export default withStores(AppLoader);