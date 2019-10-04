import React from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import StorageIcon from '@material-ui/icons/Storage';
import VisibleIcon from '@material-ui/icons/Visibility';
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Collection from '../Collections/Collection';
import CollectionsMenu from '../Navigation/CollectionsMenu';
import User from '../Users/User';
import UsersMenu from '../Navigation/UsersMenu';
import Nodes from '../Nodes/Nodes';
import TopBar from '../Navigation/TopBar';
import QueryEditor from '../Editor/QueryEditor';
import QueryEditorMenu from '../Navigation/QueryEditorMenu';
import Watcher from '../Watcher/Watcher';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';
import {DrawerLayout, ErrorToast, TopBarMenu} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match', 'openEditor']
}, {
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}]);


const useStyles = makeStyles(theme => ({
    hide: {
        display: 'none',
    },
    page: {
        display: 'flex',
    },
    menu: {
        minWidth: 220,
        padding: theme.spacing(1),
        width: '15%',
    },
    submenu: {
        marginBottom: theme.spacing(1),
    },
    content: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingRight: theme.spacing(1),
        width: '85%',
    },
}));


const App = ({collections, match, user, users, openEditor}) => {
    const classes = useStyles();
    const [indexCollection, setIndexCollection] = React.useState(0);
    const [indexUser, setIndexUser] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [drawerContent, setDrawerContent] = React.useState(0);

    React.useEffect(() => {
        ThingsdbActions.getInfo();
        const setPoll = setInterval(
            () => {
                ThingsdbActions.getInfo();
            }, 5000);
        return () => {
            clearInterval(setPoll);
        };
    }, []);

    const findItem = (index, target) => target.length ? (index+1 > target.length ? findItem(index-1, target) : target[index]) : {};
    const selectedCollection = findItem(indexCollection, collections);
    const selectedUser = findItem(indexUser, users);

    const pages = {
        collection: <Collection collection={selectedCollection} />,
        user: <User user={selectedUser} collections={collections} />,
    };

    const handleClickCollection = (i) => {
        setIndexCollection(i);
    };

    const handleClickUser = (i) => {
        setIndexUser(i);
    };

    const handleDrawerOpen = (index) => () => {
        setDrawerContent(index);
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    return(
        <DrawerLayout
            open={open}
            onClose={handleDrawerClose}
            topbar={
                <TopBar user={user}>
                    <TopBarMenu menuIcon={<MenuIcon />}>
                        <List>
                            <ListItem button onClick={handleDrawerOpen(0)} >
                                <ListItemIcon>
                                    <StorageIcon />
                                </ListItemIcon>
                                <ListItemText primary="NODES" />
                            </ListItem>
                            <ListItem button onClick={handleDrawerOpen(1)} >
                                <ListItemIcon>
                                    <VisibleIcon />
                                </ListItemIcon>
                                <ListItemText primary="WATCHER" />
                            </ListItem>
                        </List>
                    </TopBarMenu>
                </TopBar>
            }
            mainContent={
                <div className={classes.page}>
                    <div className={classes.menu}>
                        <Card className={classes.submenu}>
                            <CollectionsMenu collections={collections} onClickCollection={handleClickCollection} />
                        </Card>
                        <Card className={classes.submenu}>
                            <UsersMenu users={users} onClickUser={handleClickUser} />
                        </Card>
                        <Card className={classes.submenu}>
                            <QueryEditorMenu />
                        </Card>
                    </div>
                    <div className={classes.content}>
                        {pages[match.path]}
                    </div>
                    <ErrorToast />
                    <QueryEditor show={openEditor} />
                </div>
            }
            drawerTitle={drawerContent ? 'WATCHER' : 'NODES'}
            drawerContent={drawerContent ? <Watcher /> : <Nodes />}
        />
    );
};

App.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    openEditor: ApplicationStore.types.openEditor.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(App);