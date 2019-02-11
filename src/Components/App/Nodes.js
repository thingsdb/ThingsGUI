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
    keys: ['nodes'],
});

class Nodes extends React.Component {
    state = {
        node: null,
    }

    handleClickNode = (node) => {
        this.setState({node});
        // ApplicationActions.query(node);
    }

    render() {
        const {nodes} = this.props;
        const {node} = this.state;

        const rows = nodes;

        return node ? (
            null
        ) : (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {'Address'}
                            </TableCell>
                            <TableCell align="right">
                                {'Port'}
                            </TableCell>
                            <TableCell align="right">
                                {'Status'}
                            </TableCell>
                            <TableCell align="right">
                                {'Commited event ID'}
                            </TableCell>
                            <TableCell align="right">
                                {'Stored event ID'}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(d => (
                            <TableRow key={d.node_id}>
                                <TableCell component="th" scope="row">
                                    <Link href="javascript:;" onClick={() => this.handleClickNode(d)}>
                                        {d.address}
                                    </Link>
                                </TableCell>
                                <TableCell align="right">
                                    {d.port}
                                </TableCell>
                                <TableCell align="right">
                                    {d.status}
                                </TableCell>
                                <TableCell align="right">
                                    {d.committed_event_id}
                                </TableCell>
                                <TableCell align="right">
                                    {d.stored_event_id}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>
        );
    }
}

Nodes.propTypes = {
    nodes: ApplicationStore.types.nodes.isRequired
};

export default withStores(Nodes);