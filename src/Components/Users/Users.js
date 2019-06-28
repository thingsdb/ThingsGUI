/* eslint-disable react/no-multi-comp */
// import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import Tabel from '../Util/Table2';
import AddUser from './Add';
import User from './User';
import {useStore} from '../../Stores/ApplicationStore';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const Users = () => {
    const [store] = useStore();
    const {users} = store;
    
    const rows = users;
    const header = [{
        ky: 'name',
        label: 'User',
    }];
    const rowExtend = (row) => <User user={row} />;

    return (
        <React.Fragment>
            <Tabel header={header} rows={rows} rowExtend={rowExtend} />
            <AddUser />
        </React.Fragment>
    );
};

Users.propTypes = {
    // classes: PropTypes.object.isRequired,
    // users: ApplicationStore.types.users.isRequired
};

export default withStyles(styles)(Users);