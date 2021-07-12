import {Link as RouterLink} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import React from 'react';
import TimerIcon from '@material-ui/icons/Timer';
import Typography from '@material-ui/core/Typography';

import {TIMER_ROUTE} from '../../Constants/Routes';
import {nextRunFn} from '../Util';


const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
    },
    action: {
        paddingTop: 10,
    },
    marginLeft: {
        marginLeft: theme.spacing(1)
    },
    pos: {
        marginBottom: 12,
        display: 'flex'
    },
    title: {
        fontSize: 14,
    },
}));

const TimerCard = ({timer, size}) => {
    const classes = useStyles({size});

    return (
        <Card className={classes.root}>
            <CardActionArea className={classes.action} component={RouterLink} to={`/${TIMER_ROUTE}/${timer.id}`}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {timer.doc}
                    </Typography>
                    <Typography display="block" variant="h5" component="h2">
                        <TimerIcon />
                        {': '}
                        {timer.id}
                    </Typography>
                    <Typography variant="body2" gutterBottom component='div' className={classes.pos} color="textSecondary">
                        <Box >
                            {'Next run: '}
                        </Box>
                        <Box fontWeight="fontWeightBold" className={classes.marginLeft}>
                            {nextRunFn(timer.next_run)}
                        </Box>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    );
};

TimerCard.defaultProps = {
    size: 'default',
};

TimerCard.propTypes = {
    timer: PropTypes.object.isRequired,
    size: PropTypes.string
};

export default TimerCard;