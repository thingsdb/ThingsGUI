import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import {Add} from './Config';
import OpenNodeGraph from './SVGNodes/OpenNodeGraph';

const useStyles = makeStyles(theme => ({
    buttons: {
        padding: theme.spacing(1),
    },
}));


const NodeButtons = ({nodes}) => {
    const classes = useStyles();
    return (
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
                <Grid item>
                    <OpenNodeGraph nodes={nodes} />
                </Grid>
            </Grid>
        </Grid>
    );
};

NodeButtons.propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NodeButtons;