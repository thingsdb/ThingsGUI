import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {ApplicationActions} from '../../Stores/ApplicationStore';

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


const AppLoader = () => {

    const classes = useStyles();
    React.useEffect(() => {
        ApplicationActions.connected();
    }, []);


    return(
        <React.Fragment>
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
                            src="/static/img/thingsdb.gif"
                            alt="loading..."
                            draggable="false"
                            width="100"
                        />

                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default AppLoader;