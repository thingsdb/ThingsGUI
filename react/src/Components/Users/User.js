import {useLocation} from 'react-router';
import {withVlow} from 'vlow';
import Grid from '@mui/material/Grid';
import React from 'react';

import {UserAccess} from './Config';
import Tokens from './Tokens';
import {ThingsdbActions, ThingsdbStore} from '../../Stores';
import {getNameFromPath, isObjectEmpty, TitlePage} from '../Utils';
import {USER_ROUTE} from '../../Constants/Routes';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}]);

const User = ({user, users, collections}) => {
    let location = useLocation();

    React.useEffect(() => {
        ThingsdbActions.getUsers();
        ThingsdbActions.getCollections();
    }, []);

    const users2 =
        users.length ? users
            : isObjectEmpty(user) ? []
                : [user];

    const userName = getNameFromPath(location.pathname, USER_ROUTE);
    const selectedUser = users2.find(u => u['name'] === userName);

    return (
        isObjectEmpty(selectedUser) ? null
            : (
                <TitlePage
                    preTitle='Authentication of:'
                    title={selectedUser.name}
                    content={
                        <React.Fragment>
                            <Grid item md={12} xs={12}>
                                <UserAccess user={selectedUser} collections={collections} />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Tokens user={selectedUser} />
                            </Grid>
                        </React.Fragment>
                    }
                />
            )
    );
};

User.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(User);
