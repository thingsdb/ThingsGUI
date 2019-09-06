import Paper from '@material-ui/core/Paper';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles} from '@material-ui/core/styles';

import {Tree} from '../Util';

const useStyles = makeStyles(() => ({
    card: {
        backgroundColor: '#141719',
        minHeight: 'calc(100vh - 60vh)',
    },
}));

const QueryOutput = ({output}) => {
    const classes = useStyles();
    return (
        <Paper className={classes.card} >
            <Tree
                tree={output}
            />
        </Paper>

    );
};


QueryOutput.propTypes = {
    output: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
};
export default QueryOutput;