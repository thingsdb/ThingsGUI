import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ViewIcon from '@mui/icons-material/Visibility';

import {SimpleModal} from '../../../Util';
import Overview from './Overview';


const ViewDialog = ({category, headers, item, link, onChangeItem, onClose, open, rows, scope}) => {
    const [openView, setOpenView] = React.useState(false);
    const [viewItem, setViewItem] = React.useState(null);

    const handleOpenView = (ky, row) => () => {
        setOpenView(true);
        setViewItem(row);
    };

    const handleCloseView = () => {
        setOpenView(false);
        setViewItem(null);
    };

    const badgeButton = (h, row) => (
        h.ky === 'definition' ? (
            <ButtonBase onClick={handleOpenView(h.ky, row)}>
                <ViewIcon color="primary" style={{fontSize: 20}} />
            </ButtonBase>
        ):null
    );


    return(
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
                            <ListItem>
                                <ListItemText
                                    primary="Wrap-only mode:"
                                    secondary={item.wrap_only ? 'Enabled' : 'Disabled'}
                                />
                            </ListItem>
                        ) : null}
                        <Overview badgeButton={badgeButton} headers={headers} item={item} link={link} onChangeItem={onChangeItem} rows={rows} scope={scope} />
                    </List>
                </Grid>
                {viewItem&&
                    <SimpleModal
                        open={openView}
                        onClose={handleCloseView}
                        maxWidth="md"
                    >
                        <Grid container spacing={1}>
                            <Grid container spacing={1} item xs={12}>
                                <Grid item xs={8}>
                                    <Typography variant="body1" >
                                        {'View definition:'}
                                    </Typography>
                                    <Typography variant="h4" color='primary' component='span'>
                                        {viewItem.propertyName||''}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <List disablePadding dense>
                                    <ListItem>
                                        <TextField
                                            fullWidth
                                            multiline
                                            type="text"
                                            value={viewItem.definition||''}
                                            variant="standard"
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                            }}
                                            inputProps={{
                                                style: {
                                                    fontFamily: 'monospace',
                                                },
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </SimpleModal>}
            </Grid>
        </SimpleModal>

    );
};

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
