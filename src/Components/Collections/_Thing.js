/* eslint-disable react/no-multi-comp */
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import {withVlow} from 'vlow';

import {withStyles} from '@material-ui/core/styles';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import ServerError from '../Util/ServerError';


const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
});

const initialState = {
    show: false,
    serverError: '',
};


const Thing2 = ({classes, name, thing, collection}) => {
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;

    const renderThing = ([k, v]) => { // QUEST: ???
        return (
            <div key={k} className={classes.nested}>
                <Thing2 
                    classes={classes} 
                    thing={v} 
                    name={k} 
                    collection={collection} 
                /> 
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([i.toString(), t]))
            :
            Object.entries(thing).map(renderThing);
    };

    const handleClick = () => {
        setState({...state, show: !show}); // QUEST: work with prevstate?
    };

    const canToggle = typeof(thing) === 'object';
    const val = canToggle ? Array.isArray(thing) ? `[${thing.length}]` : '{}' : thing.toString();

    return (
        <React.Fragment>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={name} secondary={val} />
                {canToggle ? show ? <ExpandLess /> : <ExpandMore /> : null}
            </ListItem>
            {canToggle &&
            <Collapse in={show} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    {renderChildren()}
                </List>
            </Collapse>}
        </React.Fragment>
    );
};

Thing2.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    collection: PropTypes.object.isRequired,

    /* styles proeperties */ 
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Thing2);
