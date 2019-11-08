/* eslint-disable react/no-multi-comp */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
    card: {
        backgroundColor: '#141719',
        //minHeight: 'calc(100vh - 60vh)',
        padding: theme.spacing(2),
    },
    tabs: {
        marginBottom: theme.spacing(2),
    },
    number: {
        color: theme.palette.primary.yellow,
    },
    key: {
        color: theme.palette.primary.white,
    },
    string: {
        color: theme.palette.primary.orange,
    },
    boolean: {
        color: theme.palette.primary.pink,
    },
    null: {
        color: theme.palette.primary.red,
    },
}));


const JsonBranch = ({name, type, val, onRenderChildren}) => {
    const classes = useStyles();

    const renderChildren = () => {
        console.log(type);
        return onRenderChildren();
    };

    return (
        <React.Fragment>
            <ListItem className={classes.listItem}>
                <ListItemText
                    className={classes.listItem}
                    primary={
                        <React.Fragment>
                            {name ? (
                                <Typography
                                    variant="body1"
                                    color="primary"
                                    component="span"
                                >
                                    {`${name}:  `}
                                </Typography>

                            ) : null}
                            <Typography
                                variant="body1"
                                color="primary"
                                component="span"
                                className={classes[type]}
                            >
                                {`${val}`}
                            </Typography>
                        </React.Fragment>
                    }
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true
                    }}
                />
            </ListItem>
            {onRenderChildren ? (
                <List component="div" disablePadding dense>
                    {renderChildren()}
                </List>
            ) : null}
        </React.Fragment>
    );
};

JsonBranch.defaultProps = {
    name: null,
    onRenderChildren: null,
};

JsonBranch.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string.isRequired,
    val: PropTypes.string.isRequired,
    onRenderChildren: PropTypes.func,
};

export default JsonBranch;
