import { Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';

import { CollectionsMenu, OverviewMenu, ProceduresMenu, TasksMenu, TopBar, UsersMenu, QueryEditorMenu } from '../Navigation';
import { COLLECTION_ROUTE, EDITOR_ROUTE, PROCEDURE_ROUTE, TASK_ROUTE, USER_ROUTE } from '../../Constants/Routes';
import { DrawerLayout, ErrorToast, getIdFromPath } from '../Utils';
import { Procedure, Task } from '../ProceduresAndTasks';
import Collection from '../Collections';
import Editor from '../Editor';
import HeaderTitle from './HeaderTitle';
import DashboardPage from '../DashboardPage';
import Nodes from '../Nodes';
import User from '../Users';
import Welcome from '../Welcome';

const nodes = 'nodes';
const App = () => {
    let location = useLocation();
    let [searchParams, setSearchParams] = useSearchParams();

    const [menuOpen, setMenuOpen] = React.useState(true);
    const [drawerContent, setDrawerContent] = React.useState(() => {
        let drawerParam = searchParams.get('drawer');
        if (drawerParam) {
            return drawerParam;
        }
        return null;
    });

    const collectionName = getIdFromPath(location.pathname, COLLECTION_ROUTE);
    const userName = getIdFromPath(location.pathname, USER_ROUTE);
    const procedureName = getIdFromPath(location.pathname, PROCEDURE_ROUTE);
    const taskId = getIdFromPath(location.pathname, TASK_ROUTE);

    const handleDrawerOpen = () => {
        const current = Object.fromEntries(searchParams);
        setSearchParams({ ...current, drawer: nodes });
        setDrawerContent(nodes);
    };

    const handleDrawerClose = () => {
        const drawer = searchParams.has('drawer');
        if (drawer) {
            searchParams.delete('drawer');
            setSearchParams(searchParams);
        }
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
                            <Routes>
                                <Route path="/" element={<Welcome />} />
                                <Route path={`/${COLLECTION_ROUTE}/${collectionName}`} element={<Collection />} />
                                <Route path={`/${USER_ROUTE}/${userName}`} element={<User />} />
                                <Route path={`/${PROCEDURE_ROUTE}/${procedureName}`} element={<Procedure />} />
                                <Route path={`/${TASK_ROUTE}/${taskId}`} element={<Task />} />
                                <Route path={`/${EDITOR_ROUTE}`} element={<Editor />} />
                            </Routes>
                        </Grid>
                    </Grid>
                }
                menuOpen={menuOpen}
                menus={[<OverviewMenu key="overview_menu" />, <CollectionsMenu key="collections_menu" />, <UsersMenu key="users_menu" />, <ProceduresMenu key="procedures_menu" />, <TasksMenu key="tasks_menu" />, <QueryEditorMenu key="editor_menu" />]}
                drawerTitle={'NODES'}
                drawerContent={<Nodes />}
                toast={<ErrorToast />}
            />
        </React.Fragment>
    );
};

export default App;