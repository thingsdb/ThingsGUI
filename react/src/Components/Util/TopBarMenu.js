import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';


const useStyles = makeStyles(theme => ({
    color: {
        color: theme.palette.text.primary
    },
}));


const TopBarMenu = ({ children, menuIcon, menuTooltip}) => {
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
            <Tooltip disableFocusListener disableTouchListener title={menuTooltip}>
                <div>
                    <IconButton
                        aria-haspopup="true"
                        aria-owns={isOpen ? 'menu' : null}
                        edge="end"
                        onClick={handleMenuOpen}
                        className={classes.color}
                    >
                        {menuIcon}
                    </IconButton>
                </div>
            </Tooltip>
            <Popover
                id="menu"
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
    menuTooltip: PropTypes.string.isRequired,
};

export default TopBarMenu;
