import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import Typography from '@material-ui/core/Typography';

import {EventStore} from '../../../../Stores';

const withStores = withVlow([{
    store: EventStore,
    keys: ['events']
}]);

const RoomEvent = ({room, events}) => {

    // stringify thingId
    const roomId = room.includes('room:') ? room.split(':')[1] : null;
    const roomEvents = roomId !== null && events[roomId] || [];
    console.log({events, roomEvents, room, roomId})

    const lastIndex = roomEvents.length -1;

    return (
        <Timeline align="alternate">
            {roomEvents.map((e, index) => (
                <TimelineItem key={`room_event_${index}`}>
                    <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                            {e.receivedAt}
                        </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary" />
                        {lastIndex !== index && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography variant="subtitle2">
                            {e.event}
                        </Typography>
                        {e.args.map((a, index) => (
                            <Typography key={`argument_${index}`} variant="body2">
                                {a}
                            </Typography>
                        ))}
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
};

RoomEvent.propTypes = {
    room: PropTypes.string.isRequired,

    // Event properties
    events: EventStore.types.events.isRequired,
};

export default withStores(RoomEvent);