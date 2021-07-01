import {makeStyles} from '@material-ui/core/styles';
import {Link as RouterLink} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {USER_ROUTE} from '../../Constants/Routes';

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

const UserCard = ({user, size}) => {
    const classes = useStyles({size});

    return (
        <Card className={classes.root}>
            <CardActionArea className={classes.action} component={RouterLink} to={`/${USER_ROUTE}/${user.name}`}>
                <CardMedia
                    className={classes.media}
                    image="/img/thingsdb-logo.png"
                    title="ThingsDB"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom component='div' className={classes.flex}>
                        <Box >
                            {'Created: '}
                        </Box>
                        <Box fontWeight="fontWeightBold" className={classes.marginLeft}>
                            {moment.unix(user.created_at).fromNow()}
                        </Box>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    );
};

UserCard.defaultProps = {
    size: 'default',
};

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
    size: PropTypes.string
};

export default UserCard;