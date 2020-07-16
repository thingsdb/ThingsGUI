/* eslint-disable react/no-multi-comp */
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {SimpleModal} from '../../../Util';
import Overview from './Overview';
import {Wpo} from './AddEditProperty';


const ViewDialog = ({category, headers, item, link, onChangeItem, onClose, open, rows, scope}) => (
    <SimpleModal
        open={open}
        onClose={onClose}
        maxWidth="md"
    >
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Typography variant="body1" >
                        {`View ThingDB ${category}:`}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {item.name||''}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <List disablePadding dense>
                    {item.wrap_only!==undefined ? (
                        <React.Fragment>
                            <ListItem>
                                <ListItemText
                                    primary="Wrap-only mode:"
                                />
                            </ListItem>
                            <ListItem>
                                <Wpo input={item.wrap_only} disabled />
                            </ListItem>
                        </React.Fragment>
                    ) : null}
                    <Overview headers={headers} item={item} link={link} onChangeItem={onChangeItem} rows={rows} scope={scope} />
                </List>
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewDialog.defaultProps = {
    item: {},
    onChangeItem: ()=>null,
    open: false,
};

ViewDialog.propTypes = {
    category: PropTypes.string.isRequired,
    headers: PropTypes.object.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onChangeItem: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    rows: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default ViewDialog;
