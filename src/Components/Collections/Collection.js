import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {CollectionConfig} from './Config';
import CollectionTree from './Tree';
import CollectionProcedures from './Procedures';
import CollectionTypes from './Types';
import {CollectionStore, ApplicationStore, ThingsdbStore} from '../../Stores';
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

const useStyles = makeStyles(theme => ({
    spacing: {
        paddingBottom: theme.spacing(1),
        // margin: 0,
    },
}));

const Collection = ({match, collections}) => {
    const classes = useStyles();
    const selectedCollection = findItem(match.index, collections);

    return (
        <TitlePage
            preTitle='Overview of:'
            title={selectedCollection.name}
            content={
                <React.Fragment>
                    <Grid container item md={7} xs={12}>
                        <Grid className={classes.spacing} item xs={12}>
                            <CollectionConfig collection={selectedCollection} />
                        </Grid>
                        <Grid item xs={12}>
                            <CollectionTree collection={selectedCollection} />
                        </Grid>
                    </Grid>
                    <Grid container item md={5} xs={12}>
                        <Grid className={classes.spacing} item xs={12}>
                            <CollectionProcedures scope={`@collection:${selectedCollection.name}`} />
                        </Grid>
                        <Grid item xs={12}>
                            <CollectionTypes scope={`@collection:${selectedCollection.name}`} />
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

// const areEqual = (prevProps, nextProps) => {
//     return JSON.stringify(prevProps) === JSON.stringify(nextProps);
// };


// export default withStores(React.memo(Collection, areEqual));

export default withStores(Collection);