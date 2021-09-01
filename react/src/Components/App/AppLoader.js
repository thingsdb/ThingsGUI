import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {ApplicationActions} from '../../Stores';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        position: 'absolute',
        margin: 'auto',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        maxWidth: 800,
        maxHeight: 800,
    },
    logo: {
        marginTop: 20,
    },
    wrapper: {
        width: 500,
        height: 250,
        textAlign: 'center',
    },
}));


const AppLoader = ({connect}) => {

    const classes = useStyles();
    React.useEffect(() => {
        if (connect) {
            ApplicationActions.connected();
        }
    }, [connect]);


    return(
        <Grid
            alignItems="center"
            className={classes.root}
            container
            direction="row"
            spacing={3}
            justify="center"
        >
            <Grid
                alignItems="center"
                container
                direction="column"
                spacing={3}
                justify="center"
            >
                <Grid
                    className={classes.wrapper}
                    item
                    xs={12}
                >
                    <Typography variant='h5'>
                        {'Loading...'}
                    </Typography>
                </Grid>
                <Grid
                    className={classes.wrapper}
                    item
                    xs={12}
                >
                    <img
                        className={classes.logo}
                        src="/img/thingsdb.gif"
                        alt="loading..."
                        draggable="false"
                        width="200"
                    />

                </Grid>
            </Grid>
        </Grid>
    );
};

AppLoader.propTypes = {
    connect: PropTypes.bool.isRequired,
};

export default AppLoader;