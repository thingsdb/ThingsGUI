import React from 'react';
import {useStore} from '../../Stores/ApplicationStore';

const AppLoader = () => {
    const [store] = useStore();
    const {loaded} = store;

    if (!loaded) {
        return (
            <div>
                {'Loading...'}
            </div>
        );
    }
    return null;
};

export default AppLoader;