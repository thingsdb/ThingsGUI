import {makeStyles} from '@material-ui/core/styles';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import {BottomBar, CollectionsMenu, ProceduresMenu, TimersMenu, TopBar, UsersMenu, QueryEditorMenu} from '../Navigation';
import {COLLECTION_ROUTE, EDITOR_ROUTE, PROCEDURE_ROUTE, TIMER_ROUTE, USER_ROUTE} from '../../Constants/Routes';
import {DrawerLayout, ErrorToast, getIdFromPath, historyDeleteQueryParam, historyGetQueryParam, historySetQueryParam, TopBarMenu} from '../Util';
import {Procedure, Timer} from '../ProceduresAndTimers';
import Collection from '../Collections';
import Editor from '../Editor';
import HeaderTitle from './HeaderTitle';
import LandingPage from '../LandingPage';
import Nodes from '../Nodes';
import User from '../Users';
import Welcome from '../Welcome';

const useStyles = makeStyles(() => ({
    mainGrid: {
        paddingRight: 8,
        paddingLeft: 8,
        paddingBottom: 8,
    },
}));

const nodes = 'nodes';

const App = () => {
    let history = useHistory();
    let location = useLocation();
    const classes = useStyles();

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
    const timerId = getIdFromPath(location.pathname, TIMER_ROUTE);

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
                        pageIcon={<LandingPage />}
                    />
                }
                mainContent={
                    <Grid container alignItems="flex-start">
                        <Grid className={classes.mainGrid} container item xs={12}>
                            <Switch>
                                <Route exact path="/" component={Welcome} />
                                <Route exact path={`/${COLLECTION_ROUTE}/${collectionName}`} component={Collection} />
                                <Route exact path={`/${USER_ROUTE}/${userName}`} component={User} />
                                <Route exact path={`/${PROCEDURE_ROUTE}/${procedureName}`} component={Procedure} />
                                <Route exact path={`/${TIMER_ROUTE}/${timerId}`} component={Timer} />
                                <Route exact path={`/${EDITOR_ROUTE}`} component={Editor} />
                            </Switch>
                        </Grid>
                    </Grid>
                }
                menuOpen={menuOpen}
                menus={[<CollectionsMenu key="collections_menu" />, <UsersMenu key="users_menu" />, <ProceduresMenu key="procedures_menu" />, <TimersMenu key="timers_menu" />, <QueryEditorMenu key="editor_menu" />]}
                bottomBar={<BottomBar />}
                drawerTitle={'NODES'}
                drawerContent={<Nodes />}
                toast={<ErrorToast />}
            />
        </React.Fragment>
    );
};

export default App;