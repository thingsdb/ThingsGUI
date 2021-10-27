import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import PropTypes from 'prop-types';
import React from 'react';
import TimerIcon from '@mui/icons-material/Timer';
import Typography from '@mui/material/Typography';

import { TIMER_ROUTE } from '../../Constants/Routes';
import { nextRunFn } from '../Utils';


const TimerCard = ({timer}) => (
    <Card sx={{backgroundColor: 'background.default'}}>
        <CardActionArea
            component={RouterLink}
            to={location => ({...location, pathname: `/${TIMER_ROUTE}/${timer.id}`})}
            sx={{paddingTop: '10px'}}
        >
            <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{fontSize: 14}}>
                    {timer.doc}
                </Typography>
                <Typography display="block" variant="h5" component="h2">
                    <TimerIcon />
                    {': '}
                    {timer.id}
                </Typography>
                <Typography variant="body2" gutterBottom component='div' color="textSecondary" sx={{marginBottom: '12px', display: 'flex'}}>
                    <Box>
                        {'Next run: '}
                    </Box>
                    <Box sx={{fontWeight: 'bold', marginLeft: '8px'}}>
                        {nextRunFn(timer.next_run)}
                    </Box>
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card >
);

TimerCard.propTypes = {
    timer: PropTypes.object.isRequired,
};

export default TimerCard;