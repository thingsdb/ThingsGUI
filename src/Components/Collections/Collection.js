import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withVlow} from 'vlow';

import CollectionConfig from './CollectionConfig';
import CollectionTree from './CollectionTree';
import {CollectionStore} from '../../Stores/CollectionStore';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {ThingsdbStore} from '../../Stores/ThingsdbStore';
import {findItem, TitlePage} from '../Util';


const withStores = withVlow([{
    store: CollectionStore,
}, {
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ThingsdbStore,
    keys: ['collections']
}]);

const Collection = ({match, collections}) => {
    const selectedCollection = findItem(match.index, collections);

    return (
        <TitlePage
            preTitle='Overview of:'
            title={selectedCollection.name}
            content={
                <React.Fragment>
                    <Grid item md={7} sm={12} xs={12}>
                        <CollectionTree collection={selectedCollection} />
                    </Grid>
                    <Grid item md={5} sm={12} xs={12}>
                        <CollectionConfig collection={selectedCollection} />
                    </Grid>
                </React.Fragment>
            }
        />
    );
};

Collection.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};


export default withStores(Collection);