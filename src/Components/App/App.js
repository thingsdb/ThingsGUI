import PropTypes from 'prop-types';
import React from 'react';
import { useGlobal } from 'reactn'; // <-- reactn
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from '@material-ui/core/styles';

import Collection from '../Collections/Collection';
import CollectionsMenu from '../Navigation/CollectionsMenu';
import User from '../Users/User';
import UsersMenu from '../Navigation/UsersMenu';
import Nodes from '../Nodes/Nodes';
import TopBar from '../Navigation/TopBar';
import ThingsdbActions from '../../Actions/ThingsdbActions';
import NodesActions from '../../Actions/NodesActions';
import {DrawerLayout} from '../Util';


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

const thingsActions = new ThingsdbActions();
const nodesActions = new NodesActions();


const App = ({onError}) => {
    const classes = useStyles();
    const [indexCollection, setIndexCollection] = React.useState(0);
    const [indexUser, setIndexUser] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const match = useGlobal('match')[0];
    const collections = useGlobal('collections')[0];
    const users = useGlobal('users')[0];

    React.useEffect(() => {
        thingsActions.getInfo(onError);
        nodesActions.getNodes(onError);
    },
    [],
    );

    const findItem = (index, target) => target.length ? (index+1 > target.length ? findItem(index-1, target) : target[index]) : {};
    const selectedCollection = findItem(indexCollection, collections);
    const selectedUser = findItem(indexUser, users);

    const pages = {
        collection: <Collection collection={selectedCollection} />,
        user: <User user={selectedUser} />,
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
                <TopBar >
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
                            <CollectionsMenu onClickCollection={handleClickCollection} />
                        </Card>
                        <Card className={classes.submenu}>
                            <UsersMenu onClickUser={handleClickUser} />
                        </Card>
                    </div>
                    <div className={classes.content}>
                        {pages[match.path]}
                    </div>
                </div>
            }
            drawerTitle="NODES"
            drawerContent={<Nodes />}
        />
    );
};

App.propTypes = {

    onError: PropTypes.func.isRequired,

};

export default App;