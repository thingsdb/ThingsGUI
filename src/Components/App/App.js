import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import StorageIcon from '@material-ui/icons/Storage';
import VisibleIcon from '@material-ui/icons/Visibility';

import {ApplicationStore} from '../../Stores';
import {BottomBar, CollectionsMenu, ProcedureMenu, TopBar, UsersMenu, QueryEditorMenu} from '../Navigation';
import {DrawerLayout, ErrorToast, TopBarMenu} from '../Util';
import {Procedure, Timer} from '../ProceduresAndTimers';
import Collection from '../Collections';
import Editor from '../Editor';
import HeaderTitle from './HeaderTitle';
import LandingPage from '../LandingPage';
import Nodes from '../Nodes';
import User from '../Users';
import Watcher from '../Watcher';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}]);

const App = ({match}) => {
    const [open, setOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(true);
    const [drawerContent, setDrawerContent] = React.useState(0);

    const pages = {
        collection: <Collection />,
        user: <User />,
        procedure: <Procedure />,
        timer: <Timer />,
        query: <Editor />,
    };

    const handleDrawerOpen = (index) => () => {
        setDrawerContent(index);
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenuOpen = () => {
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
    };

    return(
        <React.Fragment>
            <HeaderTitle />
            <DrawerLayout
                open={open}
                onClose={handleDrawerClose}
                topbar={
                    <TopBar
                        additionals={
                            <TopBarMenu menuIcon={<MoreVertIcon />} menuTooltip="Nodes & Watcher">
                                <List>
                                    <ListItem button onClick={handleDrawerOpen(0)} >
                                        <ListItemIcon>
                                            <VisibleIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="WATCHER" />
                                    </ListItem>
                                    <ListItem button onClick={handleDrawerOpen(1)} >
                                        <ListItemIcon>
                                            <StorageIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="NODES" />
                                    </ListItem>
                                </List>
                            </TopBarMenu>
                        }
                        menuIcon={
                            <IconButton edge="start" onClick={menuOpen ? handleMenuClose : handleMenuOpen} aria-label="close">
                                { menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
                            </IconButton>
                        }
                        pageIcon={<LandingPage />}
                    />
                }
                mainContent={
                    <Grid container alignItems="flex-start">
                        <Grid container item xs={12} style={{paddingRight:8, paddingLeft:8, paddingBottom:8}}>
                            {pages[match.path]}
                        </Grid>
                    </Grid>
                }
                menuOpen={menuOpen}
                menus={[<CollectionsMenu key="collections_menu" />, <UsersMenu key="users_menu" />, <ProcedureMenu key="procedures_menu" />, <QueryEditorMenu key="editor_menu" />]}
                bottomBar={<BottomBar />}
                drawerTitle={drawerContent ? 'NODES' : 'WATCHER'}
                drawerContent={drawerContent ? <Nodes /> : <Watcher />}
                toast={<ErrorToast />}
            />
        </React.Fragment>
    );
};

App.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
};

export default withStores(App);