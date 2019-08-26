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
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleChange = (_event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Card className={classes.card}>
            <Typography className={classes.title} variant="h5" >
                {'VIEW & MAKE THINGS'}
            </Typography>
            <StyledTabs value={tabIndex} onChange={handleChange} aria-label="styled tabs example">
                <StyledTab label="Things" />
                <StyledTab label="Custom" />
            </StyledTabs>
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
            {tabIndex === 0 &&
                <Grid
                    alignItems="stretch"
                    className={classes.grid}
                    container
                    direction="column"
                    justify="center"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Things collection={collection} onError={handleServerError} />
                    </Grid>
                </Grid>
            }
            {tabIndex === 1 &&
                <Grid
                    alignItems="stretch"
                    className={classes.grid}
                    container
                    direction="column"
                    justify="center"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Query collection={collection} />
                    </Grid>
                </Grid>
            }

        </Card>
    );
};

OverviewQuery.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default OverviewQuery;