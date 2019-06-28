import React from 'react';

import ThingRoot from './Things';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import {useStore, CollectionActions} from '../../Stores/CollectionStore';

const Collection = () => {
    const [store, dispatch] = useStore();
    const {match, things} = store;

    const fetched = Boolean(things[match.collection.collection_id]);
    const fetch = React.useCallback(CollectionActions.query(dispatch, match.collection), [match]);
    React.useEffect(() => {
        fetch();
    }, [match]);
        
    return fetched && (
        <React.Fragment>
            <ThingRoot />
            <RenameCollection collection={match.collection} />
            <RemoveCollection collection={match.collection} />
            <SetQuotas collection={match.collection} />
        </React.Fragment>
    );
};

export default Collection;