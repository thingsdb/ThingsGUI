import {makeStyles} from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import React from 'react';

import {HarmonicCardHeader} from '../Util';

const useStyles = makeStyles(theme => ({
    noPadding: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
    padding: {
        padding: theme.spacing(1)
    }
}));

const HarmonicCard = ({actionButtons, buttons, content, expand, noPadding, onCleanup, onRefresh, title, unmountOnExit}) => {
    const classes = useStyles();

    return (
        <HarmonicCardHeader
            actionButtons={actionButtons}
            expand={expand}
            onCleanup={onCleanup}
            onRefresh={onRefresh}
            title={title}
            unmountOnExit={unmountOnExit}
        >
            {noPadding ? content : (
                <CardContent>
                    {content}
                </CardContent>
            )}
            {buttons ? (
                <CardActions className={noPadding?classes.noPadding:null}>
                    {buttons}
                </CardActions>
            ) : null}
        </HarmonicCardHeader>

    );
};

HarmonicCard.defaultProps = {
    actionButtons: null,
    buttons: null,
    expand: false,
    noPadding: false,
    onCleanup: () => null,
    onRefresh: () => null,
    unmountOnExit: false,
},

HarmonicCard.propTypes = {
    actionButtons: PropTypes.object,
    buttons: PropTypes.object,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    expand: PropTypes.bool,
    noPadding: PropTypes.bool,
    onCleanup: PropTypes.func,
    onRefresh: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    unmountOnExit: PropTypes.bool,
};

export default HarmonicCard;