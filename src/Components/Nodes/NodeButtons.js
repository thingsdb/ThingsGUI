import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core';

import {Add} from './Config';


const useStyles = makeStyles(theme => ({
    buttons: {
        padding: theme.spacing(1),
    },
}));


const NodeButtons = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Grid
                className={classes.buttons}
                container
                direction="column"
                spacing={3}
            >
                <Grid item container xs={12} spacing={1} >
                    <Grid item>
                        <Add />
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default NodeButtons;