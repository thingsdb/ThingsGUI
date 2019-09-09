import Paper from '@material-ui/core/Paper';
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import { makeStyles} from '@material-ui/core/styles';

import {Tree} from '../Util';

const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: '#141719',
        minHeight: 'calc(100vh - 60vh)',
        padding: theme.spacing(2),
    },
}));

const QueryOutput = ({output}) => {
    const classes = useStyles();
    return (
        <Paper className={classes.card} >
            <List
                component="nav"
                dense
                disablePadding
            >
                <Tree tree={output} />
            </List>
        </Paper>

    );
};

QueryOutput.defaultProps = {
    output: null,
};

QueryOutput.propTypes = {
    output: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};
export default QueryOutput;