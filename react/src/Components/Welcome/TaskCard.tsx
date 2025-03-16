import { Link as RouterLink } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import PropTypes from 'prop-types';
import React from 'react';
import TaskIcon from '@mui/icons-material/Task';
import Typography from '@mui/material/Typography';

import { nextRunFn } from '../Utils';
import { TASK_ROUTE } from '../../Constants/Routes';


const TaskCard = ({task}: Props) => (
    <Card sx={{backgroundColor: 'background.default'}}>
        <CardActionArea
            component={RouterLink}
            to={`/${TASK_ROUTE}/${task.id}`}
            sx={{paddingTop: '10px'}}
        >
            <CardContent>
                <Typography display="block" variant="h5" component="h2">
                    <TaskIcon />
                    {': '}
                    {task.id}
                </Typography>
                <Typography variant="body2" gutterBottom component='div' color="textSecondary" sx={{marginBottom: '12px', display: 'flex'}}>
                    <Box>
                        {'Next run at: '}
                    </Box>
                    <Box sx={{fontWeight: 'bold', marginLeft: '8px'}}>
                        {nextRunFn(task.at)}
                    </Box>
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card >
);

TaskCard.propTypes = {
    task: PropTypes.object.isRequired,
};

export default TaskCard;

interface Props {
    task: ITask;
}