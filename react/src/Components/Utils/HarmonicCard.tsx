import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import PropTypes from 'prop-types';
import React from 'react';

import {HarmonicCardHeader} from '.';


const HarmonicCard = ({
    actionButtons = null,
    buttons = null,
    content,
    expand = false,
    noPadding = false,
    onCleanup = () => null,
    onRefresh = () => null,
    title,
    unmountOnExit = false,
}) => (
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
            <CardActions sx={{...(noPadding && {padding: 0})}}>
                {buttons}
            </CardActions>
        ) : null}
    </HarmonicCardHeader>

);

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