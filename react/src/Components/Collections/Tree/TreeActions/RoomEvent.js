import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
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
                                    <Box fontWeight="fontWeightBold">
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