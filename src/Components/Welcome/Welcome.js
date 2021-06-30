import {useLocation} from 'react-router-dom';
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {ThingsdbActions, ThingsdbStore} from '../../Stores';
import {getIdFromPath, isObjectEmpty, TitlePage} from '../Util';
import CollectionCard from './CollectionCard';
import NewCard from './NewCard';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}]);

const Welcome = ({collections, user}) => {

    return (
        <TitlePage
            preTitle='Welcome,'
            title={user.name}
            content={
                collections.map((collection, index) => (
                    <Grid item key={index}>
                        <CollectionCard
                            collection={collection}
                        />
                    </Grid>
                ))
            }
        />
    );
};

Welcome.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(Welcome);
