import makeStyles from '@mui/styles/makeStyles';
import {Link as RouterLink} from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {COLLECTION_ROUTE} from '../../Constants/Routes';

const useStyles = makeStyles(theme => ({
    root: {
        // width: props => props.size !== 'big' ? 310 : 690,
        // height: 310,
        backgroundColor: theme.palette.background.default,
    },
    action: {
        // width: props => props.size !== 'big' ? 310 : 690,
        // height: 310,
        paddingTop: 10,
    },
    media: {
        height: 150,
        width: 200,
        margin: 10,
    },
    flex: {
        display: 'flex'
    },
    marginLeft: {
        marginLeft: theme.spacing(1)
    }
}));

const CollectionCard = ({collection, size}) => {
    const classes = useStyles({size});

    return (
        <Card className={classes.root}>
            <CardActionArea
                className={classes.action}
                component={RouterLink}
                to={location => ({...location, pathname: `/${COLLECTION_ROUTE}/${collection.name}`})}
            >
                <CardMedia
                    className={classes.media}
                    image="/img/thingsdb-logo.png"
                    title="ThingsDB"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {collection.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom component='div' className={classes.flex}>
                        <Box>
                            {'Number of things: '}
                        </Box>
                        <Box className={classes.marginLeft} sx={{fontWeight: 'bold'}}>
                            {collection.things}
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom component='div' className={classes.flex}>
                        <Box >
                            {'Created: '}
                        </Box>
                        <Box className={classes.marginLeft} sx={{fontWeight: 'bold'}}>
                            {moment.unix(collection.created_at).fromNow()}
                        </Box>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    );
};

CollectionCard.defaultProps = {
    size: 'default',
};

CollectionCard.propTypes = {
    collection: PropTypes.object.isRequired,
    size: PropTypes.string
};

export default CollectionCard;