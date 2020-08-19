import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    dense: {
        padding: 0,
        margin: 0,
    },
}));

const FixedList = ({dense, items}) => {
    const classes = useStyles();

    return (
        <List className={classes.root} dense={dense} disablePadding={dense}>
            {items.map((item, index) => (
                <ListItem className={dense?classes.dense:''} key={`item-${index}-${item}`}>
                    <ListItemText primary={item} />
                </ListItem>
            ))}
        </List>
    );
};

FixedList.defaultProps = {
    dense: false,
    items: [],
};

FixedList.propTypes = {
    dense: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};

export default FixedList;