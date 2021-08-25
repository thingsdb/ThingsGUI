import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import HotelIcon from '@material-ui/icons/Hotel';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import RepeatIcon from '@material-ui/icons/Repeat';
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

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

const RoomEvent = ({room, events}) => {
    const classes = useStyles();

    // stringify thingId
    const roomId = room.includes('room:') ? room.split(':')[1] : null;
    const roomEvents = Boolean(roomId !== null && events[roomId]);

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
                        <TimelineDot>
                            <LaptopMacIcon />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                            <Typography variant="h6" component="h1">
                                {e.event}
                            </Typography>
                            {e.args.map((a, index) => (
                                <Typography key={`argument_${index}`}>
                                    {a}
                                </Typography>
                            ))}
                        </Paper>
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