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
import {Buttons, ServerError, checkType} from '../Util';


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


const Thing = ({classes, thing, collection, things, info, onServerError}) => {
    const [show, setShow] = React.useState(false);
   
    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        const infoNew = i==null ? {
            parent: info.name,
            name: k,
            id: thing['#'] || info.id,
        } : {
            parent: info.name == '$' ? info.parent : info.name,
            name: k,
            id: thing['#'] || info.id,
            index: i
        }
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <Thing 
                    classes={classes} 
                    collection={collection} 
                    things={things} 
                    thing={v}
                    info={infoNew} 
                    onServerError={onServerError}
                /> 
            </div>
        );
    };
    console.log(info);

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([`${info.name}`, t, i]))
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

    const canAdd = type === 'array' || type === 'object' || type === 'set'
    const hasButtons = !(type === 'array' && info.name === '$');
    
    return (
        <React.Fragment>
            <ListItem>
                <ListItemIcon>
                    <ButtonBase onClick={handleClick} >
                        {canToggle ? show ? <ExpandMore color={'primary'}/> : <ChevronRightIcon color={'primary'}/> : <StopIcon color={'primary'}/>}
                    </ButtonBase>
                </ListItemIcon>
                <ListItemText primary={info.hasOwnProperty('index') ? info.name + `[${info.index}]` : info.name } primaryTypographyProps={{'variant':'caption', 'color':'primary'}} secondary={val} />
                {hasButtons ? (
                    <Buttons>
                        <React.Fragment>
                            {canAdd ? (
                                <ListItemIcon>
                                    <AddThings 
                                        info={{
                                            name: info.hasOwnProperty('index') ? info.name + `[${info.index}]` : info.name,
                                            id: thing['#'] || info.id,
                                            type: type
                                        }} 
                                        collection={collection} 
                                        thing={things[thing['#']] || thing} 
                                    />
                                </ListItemIcon>
                            ) : null}
                            <ListItemIcon>
                                <EditIcon color={'primary'}/>
                            </ListItemIcon>
                            <ListItemIcon>
                                <RemoveThing 
                                    collection={collection}  
                                    thing={things[thing['#']] || thing} 
                                    info={info}  
                                />
                            </ListItemIcon>
                        </React.Fragment>
                    </Buttons>
                ) : null}
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

Thing.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    collection: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired,
    onServerError: PropTypes.func.isRequired,

    /* styles proeperties */ 
    classes: PropTypes.object.isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};

export default withStyles(styles)(withStores(Thing));
