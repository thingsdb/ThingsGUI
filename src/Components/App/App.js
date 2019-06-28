import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';

import Loader from './AppLoader';
import Login from './Login';
import Collection from '../Collections/Collection';
import Collections from '../Collections/Collections';
import Menu from './Menu';
import Nodes from '../Nodes/Nodes';
// import Things from '../Collection/Things';
// import User from '../User/User';
import Users from '../Users/Users';
import {useStore} from '../../Stores/ApplicationStore';


const styles = theme => ({
    root: {
        display: 'flex',
    },
    menu: {
        paddingTop: theme.spacing.unit * 1,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 1,
        // height: '100vh',
        // overflow: 'auto',
    },
});

const pages = {
    // things: <Things />,
    collection: <Collection />,
    collections: <Collections />,
    nodes: <Nodes />,
    // user: <User />,
    users: <Users />,
};

const App = ({classes}) => {
    const [store] = useStore();
    const {loaded, connected, match} = store;

    return loaded ? connected ? (
        <div className={classes.root}>
            <div className={classes.menu}>
                <Menu />
            </div>
            <div className={classes.content}>
                {pages[match.path]}
            </div>
        </div>
    ) : <Login /> : <Loader />;
};

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);