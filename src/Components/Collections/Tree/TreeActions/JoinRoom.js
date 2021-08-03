import PropTypes from 'prop-types';
import React from 'react';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import {withVlow} from 'vlow';

import {EventStore, EventActions} from '../../../../Stores';

const withStores = withVlow([{
    store: EventStore,
    keys: ['ids']
}]);

const JoinRoom = ({scope, tag, room, ids}) => {

    // stringify thingId
    const roomId = room.includes('room:') ? room.split(':')[1] : null;
    const hasJoined = Boolean(roomId !== null && ids[roomId]);

    const handleWatcher = () => {
        if (!hasJoined) {
            EventActions.join(
                scope,
                roomId,
                tag
            );
        } else {
            EventActions.leave(
                scope,
                roomId,
                tag
            );
        }
    };

    return (
        <Tooltip disableFocusListener disableTouchListener title={hasJoined ? 'Leave room' : 'Join room'}>
            <Fab onClick={handleWatcher} color="primary">
                {hasJoined ? 'Leave' : 'Join' }
            </Fab>
        </Tooltip>
    );
};

JoinRoom.propTypes = {
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,

    // Event properties
    ids: EventStore.types.ids.isRequired,
};

export default withStores(JoinRoom);