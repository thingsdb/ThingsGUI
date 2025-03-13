import PropTypes from 'prop-types';
import React from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import {withVlow} from 'vlow';

import {EventStore, EventActions} from '../../../../Stores';

const withStores = withVlow([{
    store: EventStore,
    keys: ['ids']
}]);

const reNumbers = /[0-9]+/g;

const RoomJoin = ({scope, tag, room, ids}: IEventStore & Props) => {
    const roomId = room.includes('room:') ? room.match(reNumbers)[0] : null;
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
                roomId,
                tag
            );
        }
    };

    return (
        <Tooltip disableFocusListener disableTouchListener title={hasJoined ? 'Leave room' : 'Join room'} sx={{color: '#000'}}>
            <Fab onClick={handleWatcher} color="primary">
                {hasJoined ? 'Leave' : 'Join' }
            </Fab>
        </Tooltip>
    );
};

RoomJoin.propTypes = {
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,

    // Event properties
    ids: EventStore.types.ids.isRequired,
};

export default withStores(RoomJoin);

interface Props {
    scope: string;
    tag: string;
    room: string;
}