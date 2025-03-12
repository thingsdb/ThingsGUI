import { useLocation } from 'react-router';
import { withVlow } from 'vlow';
import Grid from '@mui/material/Grid2';
import React from 'react';

import { ThingsdbActions, ThingsdbStore} from '../../Stores';
import { CollectionConfig} from './Config';
import { getNameFromPath, HarmonicCardHeader, isObjectEmpty, TitlePage} from '../Utils';
import { Procedures, Tasks } from '../ProceduresAndTasks';
import { COLLECTION_SCOPE } from '../../Constants/Scopes';
import { COLLECTION_ROUTE } from '../../Constants/Routes';
import CollectionTree from './Tree';
import {CollectionEnumsTypes, TypeEnumNetwork} from './EnumsTypes';


const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const Collection = ({collections}) => {
    let location = useLocation();

    React.useEffect(() => {
        ThingsdbActions.getCollections();
    }, []);

    const collectionName = getNameFromPath(location.pathname, COLLECTION_ROUTE);
    const selectedCollection = collections.find(c => c['name'] === collectionName);

    return (
        isObjectEmpty(selectedCollection) ? null : (
            <TitlePage
                preTitle='Overview of:'
                title={selectedCollection.name}
                content={
                    <React.Fragment>
                        <Grid container size={{xs: 12, md: 7}}>
                            <Grid size={12} sx={{paddingBottom: '8px'}}>
                                <HarmonicCardHeader title="INFO" unmountOnExit>
                                    <CollectionConfig collection={selectedCollection} />
                                </HarmonicCardHeader>
                            </Grid>
                            <TypeEnumNetwork collection={selectedCollection} />
                            <Grid size={12}>
                                <CollectionTree collection={selectedCollection} />
                            </Grid>
                        </Grid>
                        <Grid container size={{xs: 12, md: 7}}>
                            <Grid size={12} sx={{paddingBottom: '8px'}}>
                                <Procedures
                                    buttonsView={{add: true, cancel: false, edit: true, run: true, view: false}}
                                    dialogsView={{add: true, cancel: false, edit: true, run: true, view: false}}
                                    scope={`${COLLECTION_SCOPE}:${selectedCollection.name}`}
                                />
                            </Grid>
                            <Grid size={12} sx={{paddingBottom: '8px'}}>
                                <Tasks
                                    buttonsView={{add: true, cancel: true, edit: true, run: false, view: false}}
                                    dialogsView={{add: true, cancel: true, edit: true, run: false, view: false}}
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