import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Collection from '../Collections/Collection';
import Collections from '../Collections/Collections';
import Menu from '../Navigation/Menu';
import Nodes from '../Nodes/Nodes';
// import Things from '../Collection/Things';
// import User from '../User/User';
import Users from '../Users/Users';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import Navigation from '../Navigation/Navigation';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}]);


const styles = theme => ({
    root: {
        display: 'flex',
    },
    menu: {
        paddingTop: theme.spacing(1),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        // height: '100vh',
        // overflow: 'auto',
    },
});


const App = ({classes, match}) => {
    const [collection, setCollection] = useState({})
    const pages = {
        // things: <Things />,
        collection: <Collection collection={collection}/>,
        collections: <Collections collection={collection}/>,
        nodes: <Nodes />,
        // user: <User />,
        users: <Users />,
    };


    const handleClickCollection = (collection) => {
        setCollection(collection);
    }

    return(
        <React.Fragment>
            <Navigation />
            <div className={classes.root}>
                <div className={classes.menu}>
                    <Menu onClickCollection={handleClickCollection}/>
                </div>
                <div className={classes.content}>
                    {pages[match.path]}
                </div>
            </div>
        </React.Fragment>
    );
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    match: ApplicationStore.types.match.isRequired,
};

export default withStyles(styles)(withStores(App));