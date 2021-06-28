import {Route, Switch, useLocation} from 'react-router-dom';
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
import {BottomBar, CollectionsMenu, ProceduresMenu, TimersMenu, TopBar, UsersMenu, QueryEditorMenu} from '../Navigation';
import {DrawerLayout, ErrorToast, getIdFromPath, TopBarMenu} from '../Util';
import {Procedure, Timer} from '../ProceduresAndTimers';
import {COLLECTION_ROUTE, EDITOR_ROUTE, PROCEDURE_ROUTE, TIMER_ROUTE, USER_ROUTE} from '../../Constants/Routes';
import Collection from '../Collections';
import Editor from '../Editor';
import HeaderTitle from './HeaderTitle';
import LandingPage from '../LandingPage';
import Nodes from '../Nodes';
import User from '../Users';
import Watcher from '../Watcher';


const App = () => {
    let location = useLocation();

    const [open, setOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(true);
    const [drawerContent, setDrawerContent] = React.useState(0);

    const collectionName = getIdFromPath(location.pathname, COLLECTION_ROUTE);
    const userName = getIdFromPath(location.pathname, USER_ROUTE);
    const procedureName = getIdFromPath(location.pathname, PROCEDURE_ROUTE);
    const timerId = getIdFromPath(location.pathname, TIMER_ROUTE);

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
                            <Switch>
                                <Route exact path="/" />
                                <Route exact path={`/${COLLECTION_ROUTE}/${collectionName}`} component={Collection} />
                                <Route exact path={`/${USER_ROUTE}/${userName}`} component={User} />
                                <Route exact path={`/${PROCEDURE_ROUTE}/${procedureName}`} component={Procedure} />
                                <Route exact path={`/${TIMER_ROUTE}/${timerId}`} component={Timer} />
                                <Route path={`/${EDITOR_ROUTE}`} component={Editor} />
                            </Switch>
                        </Grid>
                    </Grid>
                }
                menuOpen={menuOpen}
                menus={[<CollectionsMenu key="collections_menu" />, <UsersMenu key="users_menu" />, <ProceduresMenu key="procedures_menu" />, <TimersMenu key="timers_menu" />, <QueryEditorMenu key="editor_menu" />]}
                bottomBar={<BottomBar />}
                drawerTitle={drawerContent ? 'NODES' : 'WATCHER'}
                drawerContent={drawerContent ? <Nodes /> : <Watcher />}
                toast={<ErrorToast />}
            />
        </React.Fragment>
    );
};

export default App;