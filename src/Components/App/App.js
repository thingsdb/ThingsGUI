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

import BottomBar from '../Navigation/BottomBar';
import Collection from '../Collections/Collection';
import CollectionsMenu from '../Navigation/CollectionsMenu';
import User from '../Users/User';
import UsersMenu from '../Navigation/UsersMenu';
import Nodes from '../Nodes/Nodes';
import TopBar from '../Navigation/TopBar';
import Query from '../Editor/Query';
import QueryEditorMenu from '../Navigation/QueryEditorMenu';
import Watcher from '../Watcher/Watcher';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {DrawerLayout, ErrorToast, TopBarMenu} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}]);


const App = ({match}) => {
    const [open, setOpen] = React.useState(false);
    const [drawerContent, setDrawerContent] = React.useState(0);

    const pages = {
        collection: <Collection />,
        user: <User />,
        query: <Query />,
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
                    <ErrorToast />
                </Grid>
            }
            bottomBar={<BottomBar />}
            drawerTitle={drawerContent ? 'NODES' : 'WATCHER'}
            drawerContent={drawerContent ? <Nodes /> : <Watcher />}
        />
    );
};

App.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    // openEditor: ApplicationStore.types.openEditor.isRequired,

};

export default withStores(App);