import {React, useState} from 'react';
import {withVlow} from 'vlow';

import ThingRoot from './Things';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import ServerError from '../Util/ServerError';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: CollectionStore,
    keys: ['things']
}]);

const Collection = ({match, things}) => {
    const [serverError, setServerError] = useState('');
    const fetched = Boolean(things[match.collection.collection_id]);
    const fetch = React.useCallback(
        () => {
            const onError = (err) => setServerError(err);
            CollectionActions.query(match.collection, onError);
        },
        [match],
    );    
    
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

Collection.propTypes = {
    /* application properties */
    match: ApplicationStore.types.match.isRequired,
    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};

export default withStores(Collection);