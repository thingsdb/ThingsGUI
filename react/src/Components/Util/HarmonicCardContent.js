import {makeStyles} from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
    padding: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
}));

const HarmonicCardContent = ({buttons, content, noPadding}) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            {noPadding ? content : (
                <CardContent>
                    {content}
                </CardContent>
            )}
            {buttons ? (
                <CardActions className={noPadding?classes.padding:null}>
                    {buttons}
                </CardActions>
            ) : null}
        </React.Fragment>
    );
};

HarmonicCardContent.defaultProps = {
    buttons: null,
    noPadding: false,
},

HarmonicCardContent.propTypes = {
    buttons: PropTypes.object,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    noPadding: PropTypes.bool,
};

export default HarmonicCardContent;