import React from 'react';

import ThingRoot from './Things';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import {useStore} from '../../Stores/ApplicationStore';
import {useCollections, CollectionsActions} from '../../Stores/CollectionsStore';

const Collection = () => {
    const [{match}] = useStore();
    const [{things}, dispatch] = useCollections();

    const fetched = Boolean(things[match.collection.collection_id]);
    const fetch = React.useCallback(CollectionsActions.query(dispatch, match.collection), [match]);
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