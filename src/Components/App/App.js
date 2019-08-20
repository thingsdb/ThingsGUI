import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import NodeButtons from '../Nodes/NodeButtons';
import Collection from '../Collections/Collection';
import CollectionsMenu from '../Navigation/CollectionsMenu';
import User from '../Users/User';
import UsersMenu from '../Navigation/UsersMenu';
import Nodes from '../Nodes/Nodes';
import TopBar from '../Navigation/TopBar';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionsActions, CollectionsStore} from '../../Stores/CollectionsStore';
import {UsersActions, UsersStore} from '../../Stores/UsersStore';
import {NodesActions, NodesStore} from '../../Stores/NodesStore';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: CollectionsStore,
    keys: ['collections']
}, {
    store: UsersStore,
    keys: ['user', 'users']
}, {
    store: NodesStore,
    keys: ['nodes']
}]);


const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 1200,
        display: 'flex',
    },
    menu: {
        width: '15%',
        minWidth: 220,
        padding: theme.spacing(1),
    },
    submenu: {
        paddingBottom: theme.spacing(1),
    },
    content: {
        width: '60%',
        padding: theme.spacing(1),
        // height: '100vh',
        // overflow: 'auto',
    },
    contentShrinked: {
        width: '0%',
    },
    sidebar: {
        width: '25%',
        minWidth: 380,
        padding: theme.spacing(1),
    },
    sidebarExpanded: {
        width: '85%',
        minWidth: 380,
        padding: theme.spacing(1),
    },
}));


const App = ({onError, collections, match, user, users, nodes}) => {
    const classes = useStyles();
    const [indexCollection, setIndexCollection] = React.useState(0)
    const [indexUser, setIndexUser] = React.useState(0)
    console.log('USERS', user, users);
    React.useEffect(() => {
            console.log('effect 1');
            UsersActions.getUsers(onError);

            // return function cleanup() {
            //     ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
            // };
        },
        [collections.length],
    );

    React.useEffect(() => {
        console.log('effect 2');
        UsersActions.getUser(onError);
        UsersActions.getUsers(onError);
        CollectionsActions.getCollections(onError); 
        NodesActions.getNodes(onError);

        // return function cleanup() {
        //     ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
        // };
    },
    [],
);
    
    const findItem = (index, target) => target.length ? (index+1 > target.length ? findItem(index-1, target) : target[index]) : {};
    const selectedCollection = findItem(indexCollection, collections);
    const selectedUser = findItem(indexUser, users)
    
    const pages = {
        collection: <Collection collection={selectedCollection} onError={onError} />,
        user: <User user={selectedUser} collections={collections} />,
    };

    const handleClickCollection = (i) => {
        setIndexCollection(i);
    }

    const handleClickUser = (i) => {
        setIndexUser(i);
    }
    
    return(
        <React.Fragment>
            <TopBar user={user} onError={onError} />
            {/* {nodes.length ? ( */}
            <div className={classes.root}>
                <div className={classes.menu}>
                    <div className={classes.submenu}>
                        <Card>
                            <CollectionsMenu collections={collections} onClickCollection={handleClickCollection}/>
                        </Card>
                    </div>
                    <div className={classes.submenu}>
                        <Card>
                            <UsersMenu users={users} onClickUser={handleClickUser}/>
                        </Card>  
                    </div>   
                </div>
                <div className={pages[match.path] ? classes.content : classes.contentShrinked}>
                    <Card>
                        {pages[match.path]}
                    </Card>    
                </div>
                <div className={pages[match.path] ? classes.sidebar : classes.sidebarExpanded}>
                    <Card>
                        <CardContent>
                            <Typography variant={'h6'}> 
                                {'NODES'}
                            </Typography>
                        </CardContent>
                        <Nodes nodes={nodes} onError={onError} />
                        <NodeButtons />
                    </Card>
                </div>
            </div>
            {/* ) : (
                null // <AppLoader /> 
            )} */}
        </React.Fragment>
    );
}

App.propTypes = {

    onError: PropTypes.func.isRequired,

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,

    /* Collections properties */
    collections: CollectionsStore.types.collections.isRequired,

    /* Users properties */
    user: UsersStore.types.user.isRequired,
    users: UsersStore.types.users.isRequired,

    /* nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(App);