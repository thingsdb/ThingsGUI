// import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import CollectionExtend from './CollectionExtend';
import Table from '../Util/Table2';
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

    render() {
        const {collections} = this.props;
        
        const rows = collections;
        const header = [{
            ky: 'name',
            label: 'Collection',
        }, {
            ky: 'things',
            label: '# Things',
        }];
        const rowClick = (collection) => {
            ApplicationActions.navigate({path: 'collection', collection});
            CollectionActions.query(collection);
        };
        const rowExtend = (collection) => <CollectionExtend collection={collection} />;
           
        return (
            <React.Fragment>
                <Table header={header} rows={rows} rowClick={rowClick} rowExtend={rowExtend} />
            </React.Fragment>
        );
    }
}

Collections.propTypes = {
    // classes: PropTypes.object.isRequired,
    collections: ApplicationStore.types.collections.isRequired,

};

export default withStores(withStyles(styles)(Collections));