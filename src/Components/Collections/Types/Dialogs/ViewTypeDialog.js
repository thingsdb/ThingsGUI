/* eslint-disable react/no-multi-comp */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {SimpleModal, TableWithButtons} from '../../../Util';

const revealType = (i) => {
    let arr = 0;
    let opt = 0;
    if(i[0]=='[' || i[0]=='{') {
        arr = 1;
    }
    if(i.includes('?')) {
        opt = arr&&i.slice(-1)=='?'&&i.slice(-3, -2)? 2: 1;
    }
    return i.slice(arr, i.length-(arr+opt));
}

const ViewTypeDialog = ({open, onClose, customType, customTypeNames, onChangeType}) => {
    const header = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyType', label: 'Type'},
    ];

    const handleClickCustomType = (i) => () => {
        console.log(i)
        onChangeType(i);
    };
    const addLink = (i, ctn) => {
        let t = revealType(i);
        return( ctn.includes(t)? (
            <React.Fragment>
                {i.length-t.length>1?i[0]:null}
                <Link component="button" onClick={handleClickCustomType(t)}>
                    {t}
                </Link>
                {i.length-t.length>2?i.slice(i.length-t.length, -1):i.length-t.length>0?i.slice(-1):null}
            </React.Fragment>
        ) : (i));
    };
    const rows = customType.fields? customType.fields.map(c=>({propertyName: c[0], propertyType: addLink(c[1], customTypeNames), propertyVal: ''})):[];

    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            maxWidth="sm"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'View ThingDB type:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {customType.name||'Add new type'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <ListItem>
                            <ListItemText
                                primary="Current properties:"
                                secondary={
                                    <Link target="_blank" href="https://docs.thingsdb.net/v0/data-types/type/">
                                        {'https://docs.thingsdb.net/v0/data-types/type/'}
                                    </Link>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <TableWithButtons
                                header={header}
                                rows={rows}
                                rowClick={()=>null}
                            />
                        </ListItem>
                        <ListItem>
                            <Grid container>
                                <Grid container item xs={11} justify="flex-end">
                                    <Box fontSize={10} fontStyle="italic" m={1}>
                                        {`Created on: ${moment(customType.created_at*1000).format('YYYY-MM-DD HH:mm:ss')}, last modified on: ${moment(customType.modified_at*1000).format('YYYY-MM-DD HH:mm:ss')}`}
                                    </Box>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

ViewTypeDialog.defaultProps = {
    customType: {},
};

ViewTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChangeType: PropTypes.func.isRequired,
    customType: PropTypes.object,
    customTypeNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ViewTypeDialog;
