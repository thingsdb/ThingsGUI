import React from 'react';
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const AppLoader = () => {
    const [store, dispatch] = useStore();
    const {loaded} = store;

    const fetch = React.useCallback(AppActions.connected(dispatch), [dispatch]);

    React.useEffect(() => {
        fetch();
    }, [loaded]);

    return (
        <div>
            {'Loading...'}
        </div>
    );
};

export default AppLoader;