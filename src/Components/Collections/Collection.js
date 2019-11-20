import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withVlow} from 'vlow';

import CollectionConfig from './CollectionConfig';
import CollectionTree from './CollectionTree';
import CollectionProcedures from './CollectionProcedures';
import CollectionTypes from './CollectionTypes';
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
                    <Grid container item md={7} xs={12} spacing={1}>
                        <Grid item xs={12}>
                            <CollectionConfig collection={selectedCollection} />
                        </Grid>
                        <Grid item xs={12}>
                            <CollectionTree collection={selectedCollection} />
                        </Grid>
                    </Grid>
                    <Grid container item md={5} xs={12} spacing={1}>
                        <Grid item xs={12}>
                            <CollectionProcedures collection={selectedCollection} />
                        </Grid>
                        <Grid item xs={12}>
                            <CollectionTypes collection={selectedCollection} />
                        </Grid>
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