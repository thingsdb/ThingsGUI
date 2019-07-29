import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import ThingRoot from './Things';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import ServerError from '../Util/ServerError';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}]);

const Collection = ({things, collection}) => {
    const [serverError, setServerError] = useState('');
    const fetched = things.hasOwnProperty(collection.collection_id);
    
    React.useEffect(() => {
        CollectionActions.query(collection, (err) => setServerError(err));
    }, [collection.collection_id]);


    return fetched && (
        <React.Fragment>
            <ThingRoot collection={collection} />
            <RenameCollection collection={collection} />
            <RemoveCollection collection={collection} />
            <SetQuotas collection={collection} />
        </React.Fragment>
    );
};

Collection.propTypes = {
    collection: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};


export default withStores(Collection);