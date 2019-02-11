/* eslint-disable react/prefer-stateless-function */
import Link from '@material-ui/core/Link';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withVlow} from 'vlow';

// import Collection from './Collection';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['users'],
});

class Users extends React.Component {
    state = {
        user: null,
    }

    handleClickUser = (user) => {
        this.setState({user});
        // ApplicationActions.query(user);
    }

    render() {
        const {users} = this.props;
        const {user} = this.state;

        const rows = users;

        return user ? (
            null
        ) : (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {'User'}
                            </TableCell>
                            <TableCell align="right">
                                {'Access'}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(d => (
                            <TableRow key={d.user_id}>
                                <TableCell component="th" scope="row">
                                    <Link href="javascript:;" onClick={() => this.handleClickUser(d)}>
                                        {d.name}
                                    </Link>
                                </TableCell>
                                <TableCell align="right">
                                    {/* {d.access} */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>
        );
    }
}

Users.propTypes = {
    users: ApplicationStore.types.users.isRequired
};

export default withStores(Users);