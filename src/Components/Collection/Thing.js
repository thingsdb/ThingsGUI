import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EditIcon from '@material-ui/icons/Edit';
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
import RemoveThing from './RemoveThing';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import {ServerError, checkType} from '../Util';


const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}]);

const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        paddingLeft: theme.spacing(6),
    },
});


const Thing = ({classes, name, id, thing, index, collection, things, onServerError}) => {
    const [show, setShow] = React.useState(false);
   
    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        console.log(i);
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <Thing classes={classes} name={k} id={thing['#'] || id} thing={v} index={i} collection={collection} things={things} onServerError={onServerError}/> 
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([`${name}`, t, i]))
            :
            Object.entries(things[thing['#']] || thing || {}).map(renderThing);
    };

    const handleClick = () => {
        setShow(!show); // QUEST: work with prevstate?
        if (thing && thing['#']) {
            CollectionActions.query(collection.collection_id, (err) => onServerError(err), thing['#']);
        }
    };

    const type = checkType(thing);
    const canToggle = type === 'object' || type === 'array' || type === 'set';
    const objectId = type === 'object' ? thing['#'] : '';
    const key = Object.keys(thing)[0];
    const val = type === 'array' ? `[${thing.length}]` 
        : type === 'object' || type === 'set' ? `{${key}${objectId}}` 
        : type === 'string' || type === 'number' ? thing.toString() 
        : ''; 
       
    
    return (
        <React.Fragment>
            <ListItem >
                <ListItemIcon>
                    <ButtonBase onClick={handleClick} >
                        {canToggle ? show ? <ExpandMore color={'primary'}/> : <ChevronRightIcon color={'primary'}/> : <StopIcon color={'primary'}/>}
                    </ButtonBase>
                </ListItemIcon>
                <ListItemText primary={index === null ? name : name + `[${index}]`} primaryTypographyProps={{'variant':'caption', 'color':'primary'}} secondary={val} />
                {type === 'array' || type === 'object' || type === 'set' ? (
                    <ListItemIcon>
                        <AddThings id={thing['#'] || id} name={index === null ? name : name + `[${index}]`} type={type} collection={collection} thing={things[thing['#']] || thing} />
                    </ListItemIcon>
                ) : null}
                <ListItemIcon>
                    <EditIcon color={'primary'}/>
                </ListItemIcon>
                <ListItemIcon>
                    <RemoveThing collection={collection} thingId={id} propertyName={name} type={type} index={index} />
                </ListItemIcon>
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

Thing.defaultProps = {
    index: null,
};

Thing.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.any.isRequired,
    collection: PropTypes.object.isRequired,
    onServerError: PropTypes.func.isRequired,
    index: PropTypes.any,

    /* styles proeperties */ 
    classes: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};

export default withStyles(styles)(withStores(Thing));
