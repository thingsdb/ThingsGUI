import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
    root: {
        minWidth: 170,
    },
}));

const Buttons = ({children}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [show, setShow] = React.useState(true);

    const handleOpenClick = () => {
        setShow(false);
        setOpen(true);
    };

    const handleExited = () => {
        setShow(true);
    };

    const handleMouseLeaveCell = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root} onMouseLeave={handleMouseLeaveCell}>
            <Collapse in={open} timeout="auto" onExited={handleExited}>
                {children}
            </Collapse>
            {show ? (
                <IconButton onClick={handleOpenClick}>
                    <MoreVertIcon color="primary" />
                </IconButton>
            ) : null}
        </div>
    );

};

Buttons.propTypes = {
    children: PropTypes.element.isRequired,
};


export default Buttons;