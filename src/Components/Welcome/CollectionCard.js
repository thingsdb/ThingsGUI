import {makeStyles} from '@material-ui/core/styles';
import {Link as RouterLink} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {COLLECTION_ROUTE} from '../../Constants/Routes';

const useStyles = makeStyles(theme => ({
    root: {
        width: 345,
        height: 310,
    },
    action: {
        width: 345,
        height: 310,
        paddingTop: 10,
    },
    media: {
        height: 150,
        width: 200,
        marginLeft: 75,
        // marginTop: 10,
    },
    flex: {
        display: 'flex'
    },
    marginLeft: {
        marginLeft: theme.spacing(1)
    }
}));

const CollectionCard = ({collection}) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea className={classes.action} component={RouterLink} to={`/${COLLECTION_ROUTE}/${collection.name}`}>
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
                        <Box >
                            {'Number of things: '}
                        </Box>
                        <Box fontWeight="fontWeightBold" className={classes.marginLeft}>
                            {collection.things}
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom component='div' className={classes.flex}>
                        <Box >
                            {'Created: '}
                        </Box>
                        <Box fontWeight="fontWeightBold" className={classes.marginLeft}>
                            {moment.unix(collection.created_at).fromNow()}
                        </Box>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    );
};

CollectionCard.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionCard;