import { makeStyles} from '@material-ui/core/styles';
import {useLocation} from 'react-router-dom';
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {ThingsdbActions, ThingsdbStore} from '../../Stores';
import {CollectionConfig} from './Config';
import {getIdFromPath, HarmonicCardHeader, isObjectEmpty, TitlePage} from '../Util';
import {Procedures, Timers} from '../ProceduresAndTimers';
import {COLLECTION_SCOPE} from '../../Constants/Scopes';
import {COLLECTION_ROUTE} from '../../Constants/Routes';
import CollectionTree from './Tree';
import CollectionEnumsTypes from './EnumsTypes';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const useStyles = makeStyles(theme => ({
    spacing: {
        paddingBottom: theme.spacing(1),
    },
}));

const Collection = ({collections}) => {
    let location = useLocation();
    const classes = useStyles();

    React.useEffect(() => {
        ThingsdbActions.getCollections();
    }, []);

    const collectionName = getIdFromPath(location.pathname, COLLECTION_ROUTE);
    const selectedCollection = collections.find(c => c['name'] === collectionName);

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
                                    <CollectionConfig collection={selectedCollection} />
                                </HarmonicCardHeader>
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
                                    scope={`${COLLECTION_SCOPE}:${selectedCollection.name}`}
                                />
                            </Grid>
                            <Grid className={classes.spacing} item xs={12}>
                                <Timers
                                    buttonsView={{add: true, edit: true, run: true, view: true}}
                                    dialogsView={{add: true, edit: true, run: true, view: true}}
                                    scope={`${COLLECTION_SCOPE}:${selectedCollection.name}`}
                                />
                            </Grid>
                            <CollectionEnumsTypes scope={`${COLLECTION_SCOPE}:${selectedCollection.name}`} />
                        </Grid>
                    </React.Fragment>
                }
            />
        )
    );
};

Collection.propTypes = {

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Collection);