import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExploreIcon from '@material-ui/icons/Explore';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import {withVlow} from 'vlow';

import {EventStore, EventActions} from '../../Stores/BaseStore';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchIds']
}]);

const WatchThings = ({collection, thingId, watchIds}) => {
    // stringify thingId
    const onWatch = watchIds.hasOwnProperty(`@collection:${collection.name}`) && watchIds[`@collection:${collection.name}`].includes(`${thingId}`);

    console.log("watch");

    const handleWatcher = () => {
        if (!onWatch) {
            EventActions.watch(
                `@collection:${collection.name}`,
                thingId
            );
        } else {
            EventActions.unwatch(
                `@collection:${collection.name}`,
                thingId
            );
        }
    };

    return (
        <React.Fragment>
            <ButtonBase onClick={handleWatcher} >
                {onWatch ? <ExploreIcon color="primary" /> : <ExploreOffIcon color="primary" />}
            </ButtonBase>
        </React.Fragment>
    );
};

WatchThings.propTypes = {
    collection: PropTypes.object.isRequired,
    thingId: PropTypes.number.isRequired,

    // Event properties
    watchIds: EventStore.types.watchIds.isRequired,
};

export default withStores(WatchThings);