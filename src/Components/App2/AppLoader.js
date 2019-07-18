import PropTypes from 'prop-types';
import React from 'react';
import {AppContext} from '../../Stores/ApplicationStore2';


const AppLoader = ({applicationStore, applicationActions}) => {
    const fetch = React.useCallback(applicationActions.connected());

    React.useEffect(() => {
        fetch();
    }, [applicationStore.loaded]);

    return (
        <div>
            {'Loading...'}
        </div>
    );
};

AppLoader.propTypes = {
    applicationStore: PropTypes.object.isRequired,
    applicationActions: PropTypes.object.isRequired,
};

export default () => (
    <AppContext.Consumer>
        {({store, actions}) => <AppLoader applicationStore={store} applicationActions={actions} />}
    </AppContext.Consumer>
);