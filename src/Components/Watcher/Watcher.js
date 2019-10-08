import React from 'react';
// import PropTypes from 'prop-types';
// import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {EventStore, EventActions} from '../../Stores/BaseStore';
import {QueryOutput} from '../Util';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchThings']
}]);

const Watcher = ({watchThings}) => {

    return (
        <React.Fragment >
            {Object.entries(watchThings).map(([k, v]) => k === '#' ? null : (
                <React.Fragment key={k}>
                    <QueryOutput output={v} />
                </React.Fragment>
            ))}
        </React.Fragment>

    );
};

Watcher.propTypes = {
    /* event properties */
    watchThings: EventStore.types.watchThings.isRequired,
};

export default withStores(Watcher);

// class ThingForGui(Thing):

//     def __init__(self, client):
//         self.client = client

//     def __new__(cls, *arg, **kwargs):
//         return Object.__new__()

//     async def on_init(self, event, data):
//         await socket.emit(self._collection._client, event, data)



// id=5 collection='stuff'

// thing = ThingForGui(id, collection)
