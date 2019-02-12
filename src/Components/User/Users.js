// import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Tabel from '../Util/Table2';
import AddUser from './Add';
import User from './User';
import {ApplicationStore} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['users'],
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Users extends React.Component {
    
    render() {
        const {users} = this.props;
        
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
    }
}

Users.propTypes = {
    // classes: PropTypes.object.isRequired,
    users: ApplicationStore.types.users.isRequired
};

export default withStores(withStyles(styles)(Users));