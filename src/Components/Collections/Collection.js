import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {ApplicationStore, ThingsdbStore} from '../../Stores';
import {CollectionConfig} from './Config';
import {findItem, HarmonicCardHeader, isObjectEmpty, TitlePage} from '../Util';
import {Procedures, Timers} from '../ProceduresAndTimers';
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
                                <HarmonicCardHeader title="INFO" unmountOnExit>
                                    <CollectionConfig collection={selectedCollection} close={(collections.length-1)!=match.index} />
                                </HarmonicCardHeader >
                            </Grid>
                            <Grid item xs={12}>
                                <CollectionTree collection={selectedCollection} />
                            </Grid>
                        </Grid>
                        <Grid container item md={5} xs={12}>
                            <Grid className={classes.spacing} item xs={12}>
                                <Procedures
                                    buttonsView={{add: true, edit: true, run: true, view: true}}
                                    dialogsView={{add: true, edit: true, run: true, view: true}}
                                    scope={`@collection:${selectedCollection.name}`}
                                />
                            </Grid>
                            <Grid className={classes.spacing} item xs={12}>
                                <Timers
                                    buttonsView={{add: true, edit: true, run: true, view: true}}
                                    dialogsView={{add: true, edit: true, run: true, view: true}}
                                    scope={`@collection:${selectedCollection.name}`}
                                />
                            </Grid>
                            <CollectionEnumsTypes scope={`@collection:${selectedCollection.name}`} />
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

export default withStores(Collection);