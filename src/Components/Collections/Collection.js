import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {ApplicationStore, ThingsdbStore} from '../../Stores';
import {CollectionConfig} from './Config';
import {findItem, isObjectEmpty, TitlePage} from '../Util';
import CollectionProcedures from './Procedures';
import CollectionTree from './Tree';
import CollectionEnumsTypes from './EnumsTypes';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ThingsdbStore,
    keys: ['collections']
}]);

const useStyles = makeStyles(theme => ({
    spacing: {
        paddingBottom: theme.spacing(1),
    },
}));

const Collection = ({match, collections}) => {
    const classes = useStyles();
    const selectedCollection = findItem(match.index, collections);

    return (
        isObjectEmpty(selectedCollection) ? null : (
            <TitlePage
                preTitle='Overview of:'
                title={selectedCollection.name}
                content={
                    <React.Fragment>
                        <Grid container item md={7} xs={12}>
                            <Grid className={classes.spacing} item xs={12}>
                                <CollectionConfig collection={selectedCollection} close={(collections.length-1)!=match.index} />
                            </Grid>
                            <Grid item xs={12}>
                                <CollectionTree collection={selectedCollection} />
                            </Grid>
                        </Grid>
                        <Grid container item md={5} xs={12}>
                            <Grid className={classes.spacing} item xs={12}>
                                <CollectionProcedures scope={`@collection:${selectedCollection.name}`} />
                            </Grid>
                            <Grid className={classes.spacing} item xs={12}>
                                <CollectionEnumsTypes scope={`@collection:${selectedCollection.name}`} />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                }
            />
        )
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