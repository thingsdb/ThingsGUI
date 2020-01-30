import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import StorageIcon from '@material-ui/icons/Storage';
import VisibleIcon from '@material-ui/icons/Visibility';
import {withVlow} from 'vlow';

import {BottomBar, CollectionsMenu, TopBar, UsersMenu, QueryEditorMenu} from '../Navigation';
import Collection from '../Collections';
import User from '../Users';
import Nodes from '../Nodes';
import Editor from '../Editor';
import Watcher from '../Watcher';
import {ApplicationStore, ProcedureStore, TypeStore} from '../../Stores';
import {DrawerLayout, ErrorToast, TopBarMenu} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: TypeStore,
}, {
    store: ProcedureStore,
}]);


const App = ({match}) => {
    const [open, setOpen] = React.useState(false);
    const [drawerContent, setDrawerContent] = React.useState(0);

    const pages = {
        collection: <Collection />,
        user: <User />,
        query: <Editor />,
    };

    const handleDrawerOpen = (index) => () => {
        setDrawerContent(index);
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    console.log('app');
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
                />
            }
            mainContent={
                <Grid container alignItems="flex-start">
                    <Grid container spacing={1} item xs={12} md={2} style={{paddingRight:8, paddingLeft:8, paddingBottom:8}}>
                        <Grid item xs={4} md={12}>
                            <Card>
                                <CollectionsMenu />
                            </Card>
                        </Grid>
                        <Grid item xs={4} md={12}>
                            <Card>
                                <UsersMenu />
                            </Card>
                        </Grid>
                        <Grid item xs={4} md={12}>
                            <Card>
                                <QueryEditorMenu />
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} md={10} style={{paddingRight:8, paddingLeft:8, paddingBottom:8}}>
                        {pages[match.path]}
                    </Grid>
                </Grid>
            }
            bottomBar={<BottomBar />}
            drawerTitle={drawerContent ? 'NODES' : 'WATCHER'}
            drawerContent={drawerContent ? <Nodes /> : <Watcher />}
            toast={<ErrorToast />}
        />
    );
};

App.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
};

export default withStores(App);