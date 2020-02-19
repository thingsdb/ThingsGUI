import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withVlow} from 'vlow';


import {UserAccess} from './Config';
import Tokens from './Tokens';
import {ApplicationStore, ThingsdbStore} from '../../Stores';
import {findItem, isObjectEmpty, TitlePage} from '../Util';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}]);

const User = ({match, user, users, collections}) => {
    const users2 =
        users.length ? users
            : isObjectEmpty(user) ? []
                : [user];

    const selectedUser = findItem(match.index, users2); // TODO CHECK

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
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(User);
