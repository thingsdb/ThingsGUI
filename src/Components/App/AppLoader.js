import React from 'react';
import {withVlow} from 'vlow';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['loaded'],
}]);

const AppLoader = ({loaded}) => {

    React.useEffect(() => {
        ApplicationActions.connected();
    }, [loaded]);

    return (
        <div>
            {'Loading...'}
        </div>
    );
};

AppLoader.propTypes = {
    loaded: ApplicationStore.types.loaded.isRequired,
};

export default withStores(AppLoader);