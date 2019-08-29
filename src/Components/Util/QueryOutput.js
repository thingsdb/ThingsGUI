import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles} from '@material-ui/core/styles';

import {Tree} from '../Util';

const useStyles = makeStyles(() => ({
    card: {
        backgroundColor: '#141719',
        minHeight: 'calc(100vh - 50vh)',
    },
}));

const QueryOutput = ({output}) => {
    const classes = useStyles();
    return (
        <Card className={classes.card} >
            <CardHeader
                title="output"
                titleTypographyProps={{variant: 'caption'}}
            />
            <CardContent>
                <Tree
                    tree={output}
                />
            </CardContent>
        </Card>

    );
};


QueryOutput.propTypes = {
    output: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
};
export default QueryOutput;