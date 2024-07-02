import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';


const FixedList = ({
    dense = false,
    items = [],
}) => (
    <List
        dense={dense}
        disablePadding={dense}
        sx={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
        }}
    >
        {items.map((item, index) => (
            <ListItem sx={{...(dense && {padding: 0, margin: 0}) }} key={`item-${index}-${item}`}>
                <ListItemText primary={item} />
            </ListItem>
        ))}
    </List>
);

FixedList.propTypes = {
    dense: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

export default FixedList;