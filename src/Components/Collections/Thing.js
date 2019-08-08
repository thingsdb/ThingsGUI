/* eslint-disable react/no-multi-comp */
import AddBoxIcon from '@material-ui/icons/AddBox';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StopIcon from '@material-ui/icons/Stop';
import PropTypes from 'prop-types';
import React from 'react';
import {withVlow} from 'vlow';

import {withStyles} from '@material-ui/core/styles';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import ServerError from '../Util/ServerError';


const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}]);

const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
});


const Thing = ({classes, name, thing, collection, things, onServerError}) => {
    const [show, setShow] = React.useState(false);
   
    const renderThing = ([k, v]) => { // QUEST: ???
        return k === '#' ? null : (
            <div key={k} className={classes.nested}>
                <Thing classes={classes} thing={v} name={k} collection={collection} things={things} onServerError={onServerError}/> 
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([i.toString(), t]))
            :
            Object.entries(things[thing['#']] || thing || {}).map(renderThing);
    };

    const handleClick = () => {
        setShow(!show); // QUEST: work with prevstate?
        if (thing && thing['#'] && !things[thing['#']]) {
            CollectionActions.queryThing(collection, thing, (err) => onServerError(err));
        }
    };

    const canToggle = typeof(thing) === 'object';
    const key = Object.keys(thing)[0];
    const id = key === '#' ? thing['#'] : '';
    const val = canToggle ? Array.isArray(thing) ? `[${thing.length}]` : `{${key}${id}}` : thing.toString();
    const header = canToggle ? Array.isArray(thing) ? name : '' : name;

    return (
        <React.Fragment>
            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    {canToggle ? show ? <ExpandMore color={'primary'}/> : <ChevronRightIcon color={'primary'}/> : <StopIcon color={'primary'}/>}
                </ListItemIcon>
                <ListItemText primary={name} primaryTypographyProps={{'variant':'caption', 'color':'primary'}} secondary={val} />
            </ListItem>
            {canToggle && 
            <Collapse in={show} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    {renderChildren()}
                    {/* <ListItem>
                        <ListItemIcon>
                            <AddBoxIcon />
                        </ListItemIcon>
                    </ListItem> */}
                </List>
            </Collapse>}
        </React.Fragment>
    );
};

Thing.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    collection: PropTypes.object.isRequired,
    onServerError: PropTypes.func.isRequired,

    /* styles proeperties */ 
    classes: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};

export default withStyles(styles)(withStores(Thing));
