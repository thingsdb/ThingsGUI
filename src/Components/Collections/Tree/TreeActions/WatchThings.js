import PropTypes from 'prop-types';
import React from 'react';
import ExploreIcon from '@material-ui/icons/Explore';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import {withVlow} from 'vlow';

import {EventStore, EventActions} from '../../../../Stores';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchIds']
}]);

const WatchThings = ({buttonIsFab, scope, tag, thingId, watchIds}) => {

    // stringify thingId
    const onWatch = Boolean(watchIds[`${thingId}`]);

    const handleWatcher = () => {
        if (!onWatch) {
            EventActions.watch(
                scope,
                thingId,
                tag
            );
        } else {
            EventActions.unwatch(
                thingId,
                tag
            );
        }
    };

    return (
        <Tooltip disableFocusListener disableTouchListener title={onWatch ? 'Turn watching off' : 'Turn watching on'}>
            {buttonIsFab ? (
                <Fab onClick={handleWatcher} color="primary">
                    {onWatch ? <ExploreOffIcon fontSize="large" /> : <ExploreIcon fontSize="large" /> }
                </Fab>
            ): (
                onWatch ? <ExploreOffIcon color="primary" /> : <ExploreIcon color="primary" />
            )}
        </Tooltip>
    );
};

WatchThings.propTypes = {
    buttonIsFab: PropTypes.bool.isRequired,
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    thingId: PropTypes.number.isRequired,

    // Event properties
    watchIds: EventStore.types.watchIds.isRequired,
};

export default withStores(WatchThings);