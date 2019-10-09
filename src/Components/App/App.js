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
import {DrawerLayout, ErrorToast, TopBarMenu} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match', 'openEditor']
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


const App = ({match, openEditor}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [drawerContent, setDrawerContent] = React.useState(0);
    console.log("APP");

    const pages = {
        collection: <Collection />,
        user: <User />,
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
                <TopBar
                    additionals={
                        <TopBarMenu menuIcon={<MenuIcon />}>
                            <List>
                                <ListItem button onClick={handleDrawerOpen(0)} >
                                    <ListItemIcon>
                                        <VisibleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="WATCHER" />
                                </ListItem>
                                <ListItem button onClick={handleDrawerOpen(1)} >
                                    <ListItemIcon>
                                        <StorageIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="NODES" />
                                </ListItem>
                            </List>
                        </TopBarMenu>
                    }
                />
            }
            mainContent={
                <div className={classes.page}>
                    <div className={classes.menu}>
                        <Card className={classes.submenu}>
                            <CollectionsMenu />
                        </Card>
                        <Card className={classes.submenu}>
                            <UsersMenu />
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
            drawerTitle={drawerContent ? 'NODES' : 'WATCHER'}
            drawerContent={drawerContent ? <Nodes /> : <Watcher />}
        />
    );
};

App.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    openEditor: ApplicationStore.types.openEditor.isRequired,

};

export default withStores(App);