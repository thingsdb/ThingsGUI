import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 170,
    },
}));

const Buttons = ({children}) => {
    const classes = useStyles();
    const [hoverOpen, setHoverOpen] = React.useState(false);
    const [zoomOpen, setZoomOpen] = React.useState(false);

    const handleOpenClick = () => {
        setHoverOpen(true);
        setZoomOpen(true);
    };

    const handleExited = () => {
        setHoverOpen(false);
    };


    const handleMouseOverCell = () => {
        setHoverOpen(true);
        setZoomOpen(true);
    }

    const handleMouseLeaveCell = () => {
        setZoomOpen(false);
    }

    return (
        <div className={classes.root} onMouseOver={handleMouseOverCell} onMouseLeave={handleMouseLeaveCell}>
            {hoverOpen ? (
                <Zoom in={zoomOpen} onExited={handleExited} >
                    {children}
                </Zoom>
            ) : null}
            {!hoverOpen ? (
                <IconButton onClick={handleOpenClick}>
                    <MoreVertIcon color="primary" />
                </IconButton>
            ) : null}          
        </div>
    );

};

Buttons.propTypes = {
    children: PropTypes.any.isRequired,
};


export default Buttons;