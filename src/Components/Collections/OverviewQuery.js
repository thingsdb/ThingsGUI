import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import Things from '../Collection/Things';
import Query from '../Collection/Query';
import { StyledTabs, StyledTab } from '../Util';

const useStyles = makeStyles(theme => ({
    grid: {
        padding: theme.spacing(2),
    },
    card: {
        padding: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
    warning: {
        color: amber[700],
    },
}));

const OverviewQuery = ({collection}) => {
    const classes = useStyles();
    const [serverError, setServerError] = React.useState('');


    const handleServerError = (err) => {
        setServerError(err.log);
    };
    const handleCloseError = () => {
        setServerError('');
    };

    return (
        <Card className={classes.card}>
            <Typography className={classes.title} variant="h5" >
                {'VIEW & MAKE THINGS'}
            </Typography>
            <Collapse in={Boolean(serverError)} timeout="auto" unmountOnExit>
                <CardHeader
                    avatar={
                        <WarningIcon className={classes.warning} />
                    }
                    action={
                        <IconButton aria-label="settings" onClick={handleCloseError}>
                            <CloseIcon />
                        </IconButton>
                    }
                    title={serverError}
                />
            </Collapse>
            <Grid
                alignItems="stretch"
                className={classes.grid}
                container
                direction="row"
                justify="center"
                spacing={1}
            >
                <Grid item xs={4}>
                    <Query collection={collection} />
                </Grid>
                <Grid item xs={8}>
                    <Typography className={classes.title} variant="body1" >
                        {'Things Tree'}
                    </Typography>
                    <Things collection={collection} onError={handleServerError} />
                </Grid>
            </Grid>
        </Card>
    );
};

OverviewQuery.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default OverviewQuery;