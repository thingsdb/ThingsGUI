import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import Typography from '@material-ui/core/Typography';

import {EventStore} from '../../../../Stores';
import {ThingsTree} from '../../../Util';

const withStores = withVlow([{
    store: EventStore,
    keys: ['events']
}]);

const RoomEvent = ({room, events}) => {

    // stringify thingId
    const roomId = room.includes('room:') ? room.split(':')[1] : null;
    const roomEvents = roomId !== null && events[roomId] || [];
    const lastIndex = roomEvents.length - 1;

    return (
        <Timeline align="left">
            {lastIndex !== -1 ? roomEvents.map((e, index) => (
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
                        <ThingsTree
                            tree={e.args}
                            child={{
                                name:'Args',
                                index:null,
                            }}
                            root
                        />
                    </TimelineContent>
                </TimelineItem>
            )) : (
                <TimelineItem key="room_event_default">
                    <TimelineContent>
                        <Typography variant="subtitle2">
                            {'No recent events'}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            )}
        </Timeline>
    );
};

RoomEvent.propTypes = {
    room: PropTypes.string.isRequired,

    // Event properties
    events: EventStore.types.events.isRequired,
};

export default withStores(RoomEvent);