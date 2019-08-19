import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Modal from '@material-ui/core/Modal';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import { amber } from '@material-ui/core/colors';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import AppLoader from '../App/AppLoader';
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
import {ServerError} from '../Util';

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


const styles = theme => ({
    root: {
        minWidth: 1200,
        display: 'flex',
    },
    snackBar:{
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
    },
    warning: {
        backgroundColor: 'transparent',
        padding: 0,
    },
    listItem: {
        backgroundColor: amber[700],
        margin: theme.spacing(1),
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
    portal: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
    }
});


const App = ({classes, collections, match, user, users, nodes}) => {
    const [indexCollection, setIndexCollection] = React.useState(0)
    const [indexUser, setIndexUser] = React.useState(0)
    const [serverError, setServerError] = React.useState([])

    React.useEffect(() => {
            console.log('effect 1');
            UsersActions.getUsers(handleServerError);
        },
        [collections.length],
    );

    React.useEffect(() => {
        console.log('effect 2');
        UsersActions.getUser(handleServerError);
        UsersActions.getUsers(handleServerError);
        CollectionsActions.getCollections(handleServerError); 
        NodesActions.getNodes(handleServerError);
    },
    [],
);
    
    const findItem = (index, target) => target.length ? (index+1 > target.length ? findItem(index-1, target) : target[index]) : {};
    const selectedCollection = findItem(indexCollection, collections);
    const selectedUser = findItem(indexUser, users)
    
    const pages = {
        collection: <Collection collection={selectedCollection}/>,
        user: <User user={selectedUser} collections={collections} />,
    };

    const handleClickCollection = (i) => {
        setIndexCollection(i);
    }

    const handleClickUser = (i) => {
        setIndexUser(i);
    }

    
    const rootRef = React.useRef(null);
    console.log(rootRef);
    const ErrorMessage = () => (
        <div className={classes.portal} ref={rootRef}>
            <List id="client-snackbar" dense>
                {serverError.map((e, i) => (
                    <ListItem key={i} className={classes.listItem}>
                        <ListItemIcon>
                            <WarningIcon />
                        </ListItemIcon>
                        <ListItemText primary={e} primaryTypographyProps={{variant: 'caption'}}/>
                        <ListItemIcon>
                            <IconButton onClick={handleCloseError(i)}>
                                <CloseIcon /> 
                            </IconButton>
                        </ListItemIcon>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const handleServerError = (err) => {
        setServerError(prevErr => {
            const newArray = [...prevErr];
            newArray.push(err.log);
            return newArray;
        });
    }

    const handleCloseError = (i) => () => {
        setServerError(prevErr => {
            const newArray = [...prevErr];
            newArray.splice(i, 1);
            return newArray;
        });
    }

    return(
        <React.Fragment>
            {ErrorMessage()}
            <TopBar user={user} />
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
                            <Nodes nodes={nodes} />
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
    classes: PropTypes.object.isRequired,

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

export default withStyles(styles)(withStores(App));