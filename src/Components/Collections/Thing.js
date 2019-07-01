/* eslint-disable react/no-multi-comp */
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import FolderIcon from '@material-ui/icons/Folder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {useStore, CollectionActions} from '../../Stores/CollectionStore';

const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
});

const Thing = ({classes, name, thing}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    const {match, things} = store;
    const [show, setShow] = React.useState(false);

    const queryThing = React.useCallback(CollectionActions.queryThing(dispatch, match.collection, thing));

    const renderThing = ([k, v]) => {
        return k === '#' ? null : (
            <div key={k} className={classes.nested}>
                <ThingWrapped thing={v} name={k} />
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([i.toString(), t]))
            :
            Object.entries(things[thing['#']] || {}).map(renderThing);
    };

    const handleClick = () => {
        setShow(!show);
        if (thing && thing['#'] && !things[thing['#']]) {
            queryThing();
        }
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
                <List component="div" disablePadding>
                    {renderChildren()}
                </List>
            </Collapse>}
        </React.Fragment>
    );
};

Thing.propTypes = {
    classes: PropTypes.object.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
};

const ThingWrapped = withStyles(styles)(Thing);

export default ThingWrapped;