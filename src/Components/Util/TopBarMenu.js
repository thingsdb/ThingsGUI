import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    color: {
        color: theme.palette.text.primary
    },
    menu: {
        top: 40,
        position: 'relative',
    },
}));


const TopBarMenu = ({ children, menuIcon}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    React.useEffect(() => {
        // add when mounted
        document.addEventListener('mousedown', handleMenuClose);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener('mousedown', handleMenuClose);
        };
    }, [handleMenuClose]);

    const handleMenuOpen = ({currentTarget}) => {
        setAnchorEl(currentTarget);
    };

    const handleMenuClose = React.useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const isOpen = Boolean(anchorEl);

    return (
        <React.Fragment>
            <Tooltip disableFocusListener disableTouchListener title="menu">
                <div>
                    <IconButton
                        aria-haspopup="true"
                        aria-owns={isOpen ? 'menu' : null}
                        onClick={handleMenuOpen}
                        className={classes.color}
                    >
                        {menuIcon}
                    </IconButton>
                </div>
            </Tooltip>
            <Popover
                id="menu"
                className={classes.menu}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handleMenuClose}
                open={isOpen}
            >
                {children}
            </Popover>
        </React.Fragment>
    );
};


TopBarMenu.propTypes = {
    children: PropTypes.object.isRequired,
    menuIcon: PropTypes.object.isRequired,
};

export default TopBarMenu;
