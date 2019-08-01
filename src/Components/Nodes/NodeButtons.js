import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core';

import AddNode from './AddNode';
import PopNode from './PopNode';
import ReplaceNode from './ReplaceNode';


const styles = theme => ({
    buttons: {
        padding: theme.spacing(1),
    },
});


const NodeButtons = ({classes}) => {

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
                            <AddNode />
                        </Grid>
                        <Grid item>
                            <PopNode />
                        </Grid>
                        <Grid item>
                            <ReplaceNode />
                        </Grid>
                    </Grid>
                </Grid>
        </React.Fragment>
    );
};

export default withStyles(styles)(NodeButtons);