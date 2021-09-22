import makeStyles from '@mui/styles/makeStyles';
import {Link as RouterLink} from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {USER_ROUTE} from '../../Constants/Routes';

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
}));

const UserCard = ({user, size}) => {
    const classes = useStyles({size});

    return (
        <Card className={classes.root}>
            <CardActionArea
                className={classes.action}
                component={RouterLink}
                to={location => ({...location, pathname: `/${USER_ROUTE}/${user.name}`})}
            >
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {user.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom component='div' className={classes.pos} color="textSecondary">
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