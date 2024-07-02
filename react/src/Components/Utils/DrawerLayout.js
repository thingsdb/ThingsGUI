import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Drawer from '@mui/material/Drawer';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';


const Flex = styled('div')(() => ({
    display: 'flex',
}));

const Main = styled('main', {shouldForwardProp: (prop) => !['open', 'menuOpen', 'newWidth', 'menuWidth', 'isResizing'].includes(prop)})(
    ({ theme, open, menuOpen, newWidth, menuWidth, isResizing }) => ({
        display: 'flex',
        flex: '1 0 auto',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        position: 'fixed',
        zIndex: 1,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open || menuOpen && {
            position: 'fixed',
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        width: open && menuOpen ? `calc(100% - ${newWidth + menuWidth}px)`
            : open ? `calc(100% - ${newWidth}px)`
                : menuOpen ? `calc(100% - ${menuWidth}px)`
                    : '100%',
        ...( menuOpen && {marginLeft: menuWidth}),
        ...( isResizing && {transition: 'none'})
    }),
);

const Body = styled('div')(() => ({
    flexGrow: 1,
    overflowY: 'auto',
    height: 'calc(100% - 121px)', // footerHeight (60) + footerMarginTop (5) + topBarHeight (48) + appBarMarginBottom (8) = 121
}));

const StyledDrawer = styled(Card, {shouldForwardProp: (prop) => prop !== 'open' && prop !== 'newWidth'})(
    ({ theme, open, newWidth }) => ({
        marginRight: '0px',
        width: 0,
        height: '100%',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            display: 'flex',
            flex: '1 0 auto',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            paddingBottom: '120px',
            position: 'fixed',
            right: 0,
            zIndex: 1200,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            width: newWidth
        }),
    }),
);

const StyledDragger = styled('div', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({ open }) => ({
        width: 0,
        ...(open && {
            alignItems: 'center',
            bottom: 0,
            cursor: 'ew-resize',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: 5,
            zIndex: 3,
        }),
    }),
);

const StyledDrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const StyledDrawerContainer = styled('div', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({ open }) => ({
        display: open ? 'block' : 'none'
    }),
);

const MenuContainer = styled('div')(() => ({
    overflow: 'auto',
}));

const Menu = styled(Drawer, {shouldForwardProp: (prop) => prop !== 'menuWidth'})(
    ({ theme, open, menuWidth }) => ({
        width: 0,
        '& .MuiDrawer-paper': {
            overflowY: 'auto',
            borderColor: theme.palette.background.paper,
            width: menuWidth,
            top: 'unset',
            paddingBottom: '120px'
        },
        ...(open && {
            menuOpen: menuWidth,
            flexShrink: 0,
        }),
    }),
);

const menuWidth = 280;

const DrawerLayout = ({
    open,
    onClose,
    topbar,
    mainContent = null,
    menuOpen,
    menus,
    toast,
    drawerTitle,
    drawerContent,
}) => {
    const [isResizing, setIsResizing] = React.useState(false);
    const [newWidth, setNewWidth] = React.useState(650);

    const handleMousemove = React.useCallback((event) => {
        let offsetRight =
            document.body.offsetWidth - (event.clientX - document.body.offsetLeft);

        let minWidth = 400;
        if (offsetRight > minWidth) {
            setNewWidth(offsetRight);
        }

    }, []);

    const handleMouseup = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMousemove);
            window.addEventListener('mouseup', handleMouseup);
        } else {
            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
        }
    },[handleMousemove, handleMouseup, isResizing]);

    const handleMousedown = () => {
        setIsResizing(true);
    };

    return(
        <div>
            {topbar}
            <Flex>
                <Menu
                    variant="persistent"
                    anchor="left"
                    open={menuOpen}
                    menuWidth={menuWidth}
                    PaperProps={{
                        square: false
                    }}
                >
                    <MenuContainer>
                        {menus.map((item, index) => (
                            <React.Fragment key={`menu_item_${index}`}>
                                {item}
                            </React.Fragment>
                        ))}
                    </MenuContainer>
                </Menu>
                <Main open={open} menuOpen={menuOpen} newWidth={newWidth} menuWidth={menuWidth} isResizing={isResizing}>
                    <Body>
                        {mainContent}
                    </Body>
                </Main>
                <StyledDrawer open={open} newWidth={newWidth}>
                    <StyledDragger open={open} onMouseDown={handleMousedown}>
                        <DragHandleIcon sx={{transform: 'rotate(90deg)'}} />
                    </StyledDragger>
                    <StyledDrawerContainer open={open}>
                        <StyledDrawerHeader>
                            <Button color="primary" onClick={onClose}>
                                {open ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                            </Button>
                            <Typography variant="body2">
                                {drawerTitle}
                            </Typography>
                        </StyledDrawerHeader>
                        <Divider />
                        {open ? drawerContent : null}
                    </StyledDrawerContainer>
                </StyledDrawer>
                {toast}
            </Flex>
        </div>
    );
};

DrawerLayout.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    menus: PropTypes.arrayOf(PropTypes.object).isRequired,
    topbar: PropTypes.object.isRequired,
    mainContent: PropTypes.object,
    toast: PropTypes.object.isRequired,
    drawerTitle: PropTypes.string.isRequired,
    drawerContent: PropTypes.object.isRequired,
};

export default DrawerLayout;