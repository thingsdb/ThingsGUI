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

const ViewTypeDialog = ({open, onClose, customType}) => {
    const header = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyType', label: 'Type'},
    ];
    const rows = customType.fields? customType.fields.map(c=>({propertyName: c[0], propertyType: c[1], propertyVal: ''})):[];

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
    customType: PropTypes.object,
};

export default ViewTypeDialog;
