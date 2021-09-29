import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { USER_ROUTE } from '../../Constants/Routes';


const UserCard = ({user}) => (
    <Card sx={{backgroundColor: 'background.default'}}>
        <CardActionArea
            component={RouterLink}
            to={location => ({...location, pathname: `/${USER_ROUTE}/${user.name}`})}
            sx={{paddingTop: '10px'}}
        >
            <CardContent>
                <Typography variant="h5" component="h2">
                    {user.name}
                </Typography>
                <Typography variant="body2" gutterBottom component='div' color="textSecondary" sx={{marginBottom: '12px', display: 'flex'}}>
                    <Box>
                        {'Created: '}
                    </Box>
                    <Box sx={{fontWeight: 'bold', marginLeft: '8px'}}>
                        {moment.unix(user.created_at).fromNow()}
                    </Box>
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card >
);

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
};

export default UserCard;