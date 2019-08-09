/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
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

import AddThings from './AddThings';
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
    divider: {
        //padding: theme.spacing(0.1),
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    listItem: {
        paddingLeft: theme.spacing(6),
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
            CollectionActions.query(collection.collection_id, (err) => onServerError(err), thing['#']);
        }
    };

    const canToggle = typeof(thing) === 'object';
    const key = Object.keys(thing)[0];
    const id = key === '#' ? thing['#'] : '';
    const val = canToggle ? Array.isArray(thing) ? `[${thing.length}]` : `{${key}${id}}` : thing.toString();
    const header = canToggle ? Array.isArray(thing) ? name : '' : name;

    return (
        <React.Fragment>
            <ListItem >
                <ListItemIcon>
                    <ButtonBase onClick={handleClick} >
                        {canToggle ? show ? <ExpandMore color={'primary'}/> : <ChevronRightIcon color={'primary'}/> : <StopIcon color={'primary'}/>}
                    </ButtonBase>
                </ListItemIcon>
                <ListItemText primary={name} primaryTypographyProps={{'variant':'caption', 'color':'primary'}} secondary={val} />
                {canToggle && !Array.isArray(thing) && show ? (
                    <ListItemIcon>
                        <AddThings collection={collection} thing={things[thing['#']] || thing} />
                    </ListItemIcon>
                ) : null}
            </ListItem>
            <Divider className={classes.divider} variant={'middle'} />
            {canToggle && 
            <Collapse in={show} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    {renderChildren()}
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
