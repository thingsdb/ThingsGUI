import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { COLLECTION_ROUTE } from '../../Constants/Routes';


const CollectionCard = ({collection}) => (
    <Card sx={{backgroundColor: 'background.default'}}>
        <CardActionArea
            component={RouterLink}
            to={`/${COLLECTION_ROUTE}/${collection.name}`}
            sx={{padding: '10px'}}
        >
            <CardMedia
                image="/img/thingsdb-logo.png"
                title="ThingsDB"
                sx={{
                    height: '150px',
                    width: '200px',
                }}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {collection.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom component='div' sx={{display: 'flex'}}>
                    <Box>
                        {'Number of things: '}
                    </Box>
                    <Box sx={{fontWeight: 'bold', marginLeft: '8px'}}>
                        {collection.things}
                    </Box>
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom component='div' sx={{display: 'flex'}}>
                    <Box >
                        {'Created: '}
                    </Box>
                    <Box sx={{fontWeight: 'bold', marginLeft: '8px'}}>
                        {moment.unix(collection.created_at).fromNow()}
                    </Box>
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card >
);

CollectionCard.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionCard;