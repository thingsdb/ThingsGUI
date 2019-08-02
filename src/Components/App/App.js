import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import NodeButtons from '../Nodes/NodeButtons';
import Collection from '../Collections/Collection';
import CollectionsMenu from '../Navigation/CollectionsMenu';
import UsersMenu from '../Navigation/UsersMenu';
import Nodes from '../Nodes/Nodes';
import Users from '../Users/Users';
import TopBar from '../Navigation/TopBar';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionsStore} from '../../Stores/CollectionsStore';
import {UsersActions, UsersStore} from '../../Stores/UsersStore';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: CollectionsStore,
    keys: ['collections']
}, {
    store: UsersStore,
    keys: ['user', 'users']
}]);


const styles = theme => ({
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
});


const App = ({classes, collections, match, user, users}) => {
    const [index, setIndex] = React.useState(0)

    React.useEffect(() => {
            UsersActions.getUsers(); 
        },
        [collections.length],
    );
    
    const findCollection = (index) => collections.length ? (index+1 > collections.length ? findCollection(index-1) : collections[index]) : {};
    const collection = findCollection(index);
    const pages = {
        collections: <Collection collection={collection}/>,
        users: <Users users={users} />,
    };

    const handleClickCollection = (i) => {
        setIndex(i);
    }

    return(
        <React.Fragment>
            <TopBar user={user} />
            <div className={classes.root}>
                <div className={classes.menu}>
                    <div className={classes.submenu}>
                        <Card>
                            <CollectionsMenu collections={collections} onClickCollection={handleClickCollection}/>
                        </Card>
                    </div>
                    <div className={classes.submenu}>
                        <Card>
                            <UsersMenu />
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
                        <Nodes />
                        <NodeButtons />
                    </Card>
                </div>
            </div>
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
};

export default withStyles(styles)(withStores(App));