import { withVlow } from 'vlow';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import React from 'react';

import { COLLECTION_SCOPE } from '../../../../Constants/Scopes';
import { CollectionStore, CollectionActions } from '../../../../Stores';
import { THING } from '../../../../Constants/ThingTypes';
import { ThingActions } from '../TreeActions';
import Thing from './Thing';
import ThingRestrict from './ThingRestrict';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}]);


const ThingRoot = ({things, collection}: ICollectionStore & Props) => {
    const [rootId, setRootId] = React.useState(null);
    const rootThing = things[rootId];

    React.useEffect(() => {
        CollectionActions.getThings(collection.name, null, setRootId);
    }, [collection.name, rootId]);

    const onChildren = React.useCallback((k, v) => (
        <Thing
            key={k}
            id={collection.collection_id}
            thing={v}
            things={things}
            collection={collection}
            parent={{
                id: rootId,
                name: 'root',
                type: THING,
                isTuple: false,
                index: null,
            }}
            child={{
                index: null,
                name: k,
                pname: k,
            }}
        />
    ), [collection, rootId, things]);

    return (
        rootThing ? (
            <List
                component="nav"
                dense
                disablePadding
            >
                <ThingRestrict
                    thing={rootThing}
                    onChildren={onChildren}
                />
                <ListItem disableGutters sx={{marginTop: '16px'}}>
                    <ThingActions
                        child={{
                            id: rootId,
                            index: null,
                            name: 'root',
                            type: THING,
                        }}
                        parent={{
                            id: null,
                            index: null,
                            name: '',
                            type: '',
                            isTuple: false,
                        }}
                        scope={`${COLLECTION_SCOPE}:${collection.name}`}
                        thing={rootThing}
                        isRoot
                    />
                </ListItem>
            </List>
        ) : (
            <LinearProgress />
        )
    );
};

ThingRoot.propTypes = {
    collection: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,

};


export default withStores(ThingRoot);

interface Props {
    collection: ICollection;
}