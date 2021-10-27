import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';

import { BottomBar, CollectionsMenu, OverviewMenu, ProceduresMenu, TopBar, UsersMenu, QueryEditorMenu } from '../Navigation';
import { COLLECTION_ROUTE, EDITOR_ROUTE, PROCEDURE_ROUTE, USER_ROUTE } from '../../Constants/Routes';
import { DrawerLayout, ErrorToast, getIdFromPath, historyDeleteQueryParam, historyGetQueryParam, historySetQueryParam } from '../Utils';
import { Procedure } from '../ProceduresAndTimers';
import Collection from '../Collections';
import Editor from '../Editor';
import HeaderTitle from './HeaderTitle';
import DashboardPage from '../DashboardPage';
import Nodes from '../Nodes';
import User from '../Users';
import Welcome from '../Welcome';

const nodes = 'nodes';
const App = () => {
    let history = useHistory();
    let location = useLocation();

    const [menuOpen, setMenuOpen] = React.useState(true);
    const [drawerContent, setDrawerContent] = React.useState(() => {
        let drawerParam = historyGetQueryParam(history, 'drawer');
        if (drawerParam) {
            return drawerParam;
        }
        return null;
    });

    const collectionName = getIdFromPath(location.pathname, COLLECTION_ROUTE);
    const userName = getIdFromPath(location.pathname, USER_ROUTE);
    const procedureName = getIdFromPath(location.pathname, PROCEDURE_ROUTE);

    const handleDrawerOpen = () => {
        historySetQueryParam(history, 'drawer', nodes);
        setDrawerContent(nodes);
    };

    const handleDrawerClose = () => {
        historyDeleteQueryParam(history, 'drawer');
        setDrawerContent(null);
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
                open={Boolean(drawerContent)}
                onClose={handleDrawerClose}
                topbar={
                    <TopBar
                        additionals={
                            <Tooltip disableFocusListener disableTouchListener title={drawerContent ? 'Close nodes' : 'View nodes'} >
                                <IconButton edge="end" onClick={drawerContent ? handleDrawerClose : handleDrawerOpen} aria-label={menuOpen ? 'close' : 'open'}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Tooltip>
                        }
                        menuIcon={
                            <IconButton edge="start" onClick={menuOpen ? handleMenuClose : handleMenuOpen} aria-label={menuOpen ? 'close' : 'open'}>
                                { menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
                            </IconButton>
                        }
                        pageIcon={<DashboardPage />}
                    />
                }
                mainContent={
                    <Grid container alignItems="flex-start">
                        <Grid container item xs={12} sx={{padding: '0px 8px 8px 8px'}}>
                            <Switch>
                                <Route exact path="/" component={Welcome} />
                                <Route exact path={`/${COLLECTION_ROUTE}/${collectionName}`} component={Collection} />
                                <Route exact path={`/${USER_ROUTE}/${userName}`} component={User} />
                                <Route exact path={`/${PROCEDURE_ROUTE}/${procedureName}`} component={Procedure} />
                                <Route exact path={`/${EDITOR_ROUTE}`} component={Editor} />
                            </Switch>
                        </Grid>
                    </Grid>
                }
                menuOpen={menuOpen}
                menus={[<OverviewMenu key="overview_menu" />, <CollectionsMenu key="collections_menu" />, <UsersMenu key="users_menu" />, <ProceduresMenu key="procedures_menu" />, <QueryEditorMenu key="editor_menu" />]}
                bottomBar={<BottomBar />}
                drawerTitle={'NODES'}
                drawerContent={<Nodes />}
                toast={<ErrorToast />}
            />
        </React.Fragment>
    );
};

export default App;