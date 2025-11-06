import { styled } from '@mui/material/styles';
import { withVlow } from 'vlow';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Collapse from '@mui/material/Collapse';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { ApplicationStore, ApplicationActions } from '../../../Stores';
import { isObjectEmpty, orderByName } from '../../Utils';
import { LoginTAG } from '../../../Constants/Tags';
import Memo from './Memo';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['cachedConnections']
}]);

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(0.5),
}));

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const tag = LoginTAG;

const ListConnections = ({onClickNewConn, onEdit, cachedConnections}) => {
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
                    <ListItem
                        disablePadding
                        secondaryAction={
                            <React.Fragment>
                                <Memo connection={v} />
                                <IconButton color="primary" onClick={handleDeleteConn(v.name)}>
                                    <DeleteIcon color="primary" />
                                </IconButton>
                                <IconButton color="primary" onClick={handleOpenDetail(v.name)}>
                                    {openDetail[v.name] ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                                </IconButton>
                            </React.Fragment>
                        }
                    >
                        <ListItemButton disableGutters onClick={handleConnectToo(v.name)}>
                            <ListItemIcon>
                                <img
                                    alt="ThingsDB Logo"
                                    src="/img/thingsdb-logo.png"
                                    draggable='false'
                                    height="25px"
                                />
                            </ListItemIcon>
                            <ListItemText primary={v.name} secondary={v.address} />
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openDetail[v.name]} timeout="auto">
                        <Grid container>
                            {rows.map((r,i)=>(
                                <Grid key={i} size={6}>
                                    <StyledCard>
                                        <StyledCardActionArea
                                            focusRipple
                                            onClick={handleClick(r.key, v)}
                                        >
                                            <Typography variant="caption">
                                                {r.title}
                                            </Typography>
                                            <Typography variant="caption" component="div" color="primary" >
                                                {`${v[r.keyList]||r.default}`}
                                            </Typography>
                                        </StyledCardActionArea>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Collapse>
                </React.Fragment>
            ))}
            {isObjectEmpty(cachedConnections) &&
                <ListItem>
                    <ListItemText secondary="No saved connections" slotProps={{secondary: {variant: 'caption'}}} />
                </ListItem>
            }
            <ListItem>
                <ListItemButton dense disableGutters onClick={onClickNewConn}>
                    <ListItemText primary="Use another connection" />
                </ListItemButton>
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