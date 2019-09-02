import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Collection from '../Collections/Collection';
import CollectionsMenu from '../Navigation/CollectionsMenu';
import User from '../Users/User';
import UsersMenu from '../Navigation/UsersMenu';
import Nodes from '../Nodes/Nodes';
import TopBar from '../Navigation/TopBar';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';
import {DrawerLayout} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ThingsdbStore,
    keys: ['collections', 'user', 'users']
}, {
    store: NodesStore,
    keys: ['nodes']
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


const App = ({onError, collections, match, user, users, nodes}) => {
    const classes = useStyles();
    const [indexCollection, setIndexCollection] = React.useState(0);
    const [indexUser, setIndexUser] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    console.log('apps');

    React.useEffect(() => {
        ThingsdbActions.getInfo(onError);
        NodesActions.getNodes(onError);
    },
    [],
    );

    const findItem = (index, target) => target.length ? (index+1 > target.length ? findItem(index-1, target) : target[index]) : {};
    const selectedCollection = findItem(indexCollection, collections);
    const selectedUser = findItem(indexUser, users);

    const pages = {
        collection: <Collection collection={selectedCollection} onError={onError} />,
        user: <User user={selectedUser} collections={collections} />,
    };

    const handleClickCollection = (i) => {
        setIndexCollection(i);
    };

    const handleClickUser = (i) => {
        setIndexUser(i);
    };

    const handleDrawerOpen = () => {
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
                <TopBar user={user} onError={onError}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        className={clsx(open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
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
                    </div>
                    <div className={classes.content}>
                        {pages[match.path]}
                    </div>
                </div>
            }
            drawerTitle="NODES"
            drawerContent={<Nodes nodes={nodes} onError={onError} />}
        />
    );
};

App.propTypes = {

    onError: PropTypes.func.isRequired,

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* Users properties */
    user: ThingsdbStore.types.user.isRequired,
    users: ThingsdbStore.types.users.isRequired,

    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(App);