import makeStyles from '@mui/styles/makeStyles';
import {withVlow} from 'vlow';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Typography from '@mui/material/Typography';

import {EventStore} from '../../../../Stores';

const withStores = withVlow([{
    store: EventStore,
    keys: ['events']
}]);

const useStyles = makeStyles(theme => ({
    flex: {
        display: 'flex'
    },
    marginLeft: {
        marginLeft: theme.spacing(1)
    }
}));

const RoomEvent = ({room, events}) => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState({});

    const handleChange = (index) => () => {
        setChecked((prev) => {
            if(prev[index] === undefined) {
                prev[index] = true;
            } else {
                prev[index] = !prev[index];
            }
            return {...prev};
        });
    };

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
                        <Card variant="outlined">
                            <CardHeader
                                title={
                                    <Box sx={{ fontWeight: 'bold' }}>
                                        {e.event}
                                    </Box>
                                }
                                titleTypographyProps={{
                                    variant: 'body2',
                                    component: 'div',
                                    className: classes.flex
                                }}
                                subheader="Arguments: "
                                subheaderTypographyProps={{
                                    className: classes.warnColor,
                                    variant: 'caption'
                                }}
                                action={
                                    <FormControlLabel
                                        control={<Switch checked={Boolean(checked[index])} onChange={handleChange(index)} />}
                                        label="Show"
                                    />
                                }
                            />
                            <CardContent>
                                <Collapse in={Boolean(checked[index])} unmountOnExit>
                                    <pre>
                                        {e.stringArgs}
                                    </pre>
                                </Collapse>
                            </CardContent>
                        </Card>
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