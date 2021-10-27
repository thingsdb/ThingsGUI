import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import PropTypes from 'prop-types';
import React from 'react';


const HarmonicCardContent = ({buttons, content, noPadding}) => (
    <React.Fragment>
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
    </React.Fragment>
);

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