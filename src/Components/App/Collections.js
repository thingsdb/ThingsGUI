/* eslint-disable react/prefer-stateless-function */
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import AddCollection from '../Collection/Add';
import Collection from '../Collection/Collection';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['collections'],
}, {
    store: CollectionStore,
    keys: [],
}]);

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Collections extends React.Component {
    state = {
        collection: null,
        mNew: false,
    }

    handleClickCollection = (collection) => {
        this.setState({collection});
        CollectionActions.query(collection);
    }

    handleClickAdd = () => {
        this.setState({mNew: true});
    }

    onAddCollection = (name) => {
        ApplicationActions.addCollection(name);
        this.setState({mNew: false});
    }

    render() {
        const {classes, collections} = this.props;
        const {collection, mNew} = this.state;

        const rows = collections;

        return collection ? (
            <Collection />
        ) : (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {'Collection'}
                            </TableCell>
                            <TableCell align="right">
                                {'# Things'}
                            </TableCell>
                            <TableCell align="right">
                                {'Quota array size'}
                            </TableCell>
                            <TableCell align="right">
                                {'Quota properties'}
                            </TableCell>
                            <TableCell align="right">
                                {'Quota raw size'}
                            </TableCell>
                            <TableCell align="right">
                                {'Quota things'}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(d => (
                            <TableRow key={d.collection_id}>
                                <TableCell component="th" scope="row">
                                    <Link href="javascript:;" onClick={() => this.handleClickCollection(d)}>
                                        {d.name}
                                    </Link>
                                </TableCell>
                                <TableCell align="right">
                                    {d.things}
                                </TableCell>
                                <TableCell align="right">
                                    {d.quota_array_size}
                                </TableCell>
                                <TableCell align="right">
                                    {d.quota_properties}
                                </TableCell>
                                <TableCell align="right">
                                    {d.quota_raw_size}
                                </TableCell>
                                <TableCell align="right">
                                    {d.quota_things}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Button variant="contained" className={classes.button} onClick={this.handleClickAdd}>
                    {'Add'}
                </Button>

                {mNew && <AddCollection onAdd={this.onAddCollection} />}
            </React.Fragment>
        );
    }
}

Collections.propTypes = {
    classes: PropTypes.object.isRequired,
    collections: ApplicationStore.types.collections.isRequired,

};

export default withStores(withStyles(styles)(Collections));