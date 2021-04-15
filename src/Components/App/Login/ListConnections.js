import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {ApplicationStore, ApplicationActions} from '../../../Stores';
import {isObjectEmpty, orderByName} from '../../Util';
import {LoginTAG} from '../../../Constants/Tags';
import Memo from './Memo';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['cachedConnections']
}]);

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
        margin: theme.spacing(0.5),
    },
    cardArea: {
        padding: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
}));

const tag = LoginTAG;

const ListConnections = ({onClickNewConn, onEdit, cachedConnections}) => {
    const classes = useStyles();
    const [openDetail, setOpenDetail] = React.useState({});

    const handleOpenDetail = (k) => () => {
        const key = openDetail[k];
        setOpenDetail({...openDetail, [k]: key?!key:true});
    };

    const handleConnectToo = (name) => () => {
        ApplicationActions.connectViaCache({name: name}, tag);
    };

    const handleClick = (ky, val) => () => {
        onEdit(ky, val);
    };

    const handleDeleteConn = (name) => () => {
        ApplicationActions.delCachedConn({name: name}, tag);
    };

    const rows = [
        {title: 'Name', key: 'name', keyList: 'name', default: ''},
        {title: 'Socket address', key: 'address', keyList: 'address', default: ''},
        {title: 'Credentials', key: 'credentials', keyList: 'credentials', default: '*****'},
        {title: 'Secure connection', key: 'security', keyList: 'secureConnection', default: false},
    ];

    const sortedConns = orderByName(Object.values(cachedConnections));
    return (
        <List>
            {sortedConns.map((v, i) => (
                <React.Fragment key={i}>
                    <ListItem button onClick={handleConnectToo(v.name)}>
                        <ListItemIcon>
                            <img
                                alt="ThingsDB Logo"
                                src="/img/thingsdb-logo.png"
                                draggable='false'
                                height="25px"
                            />
                        </ListItemIcon>
                        <ListItemText primary={v.name} secondary={v.address} />
                        <ListItemSecondaryAction>
                            <Memo connection={v} />
                            <Button color="primary" onClick={handleDeleteConn(v.name)}>
                                <DeleteIcon color="primary" />
                            </Button>
                            <Button color="primary" onClick={handleOpenDetail(v.name)}>
                                {openDetail[v.name] ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Collapse in={openDetail[v.name]} timeout="auto">
                        <Grid container>
                            {rows.map((r,i)=>(
                                <Grid key={i} item xs={6}>
                                    <Card className={classes.card}>
                                        <CardActionArea
                                            focusRipple
                                            className={classes.cardArea}
                                            onClick={handleClick(r.key, v)}
                                        >
                                            <Typography variant="caption">
                                                {r.title}
                                            </Typography>
                                            <Typography variant="caption" component="div" color="primary" >
                                                {`${v[r.keyList]||r.default}`}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Collapse>
                </React.Fragment>
            ))}
            {isObjectEmpty(cachedConnections) &&
                <ListItem>
                    <ListItemText secondary="No saved connections" secondaryTypographyProps={{variant: 'caption'}} />
                </ListItem>
            }
            <ListItem button onClick={onClickNewConn}>
                <ListItemText primary="Use another connection" />
            </ListItem>
        </List>
    );
};

ListConnections.propTypes = {
    onClickNewConn: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    cachedConnections: ApplicationStore.types.cachedConnections.isRequired,
};

export default withStores(ListConnections);