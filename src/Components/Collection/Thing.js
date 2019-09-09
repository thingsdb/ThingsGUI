/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';

import AddThings from './AddThings';
import EditThing from './EditThing';
import RemoveThing from './RemoveThing';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import {Buttons, checkType, thingValue, TreeIcon} from '../Util';


const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}]);

const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));



const Thing = ({thing, collection, things, info}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);


    // thing info
    const isTuple = type === 'array' && info.parentType === 'array';
    const thingId = thing && thing['#'] || info.id;
    const currThing = thing && things[thing['#']] || thing;
    const fancyName = (n) => info.index !== null ? n + `[${info.index}]` : n;


    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        const infoNew = {
            name: fancyName(k),
            id: thingId,
            index: i,
            parentName: info.name == '$' ? info.parentName : info.name,
            parentType: type,
            isParentTuple: isTuple,
        };
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <Thing
                    collection={collection}
                    things={things}
                    thing={v}
                    info={infoNew}
                />
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([`${info.name}`, t, i]))
            :
            Object.entries(currThing || {}).map(renderThing);
    };

    const handleClick = () => {
        setShow(!show); // QUEST: work with prevstate?
        if (thing && thing['#']) {
            CollectionActions.query(collection.collection_id, thing['#']);
        }
    };

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);

    // buttons visible
    const hasButtons = !(type === 'array' && info.name === '$' || info.isParentTuple);
    const canAdd = type === 'array' || type === 'object' || type === 'set' || !isTuple;
    const canEdit = info.name !== '$';
    const canToggle = type === 'object' || type === 'array' || type === 'set';

    console.log(info)

    return (
        <React.Fragment>
            <ListItem className={classes.listItem}>
                <ListItemIcon>
                    <TreeIcon type={type} />
                </ListItemIcon>
                <ListItemText
                    className={classes.listItem}
                    primary={
                        <React.Fragment>
                            <Typography
                                variant="body1"
                                color="primary"
                                component="span"
                            >
                                {fancyName(info.name)}
                            </Typography>
                            {`  -   ${val}`}
                        </React.Fragment>

                    }
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true
                    }}
                />
                {hasButtons ? (
                    <ListItemIcon>
                        <Buttons>
                            {canAdd ? (
                                <AddThings
                                    info={{
                                        name: fancyName(info.name),
                                        id: thingId,
                                        type: type
                                    }}
                                    collection={collection}
                                    thing={currThing}
                                />
                            ) : null}
                            {canEdit ? (
                                <EditThing
                                    info={{...info, type: type}}
                                    collection={collection}
                                    thing={things[info.id]}
                                />
                            ) : null}
                            <RemoveThing
                                collection={collection}
                                thing={currThing}
                                info={info}
                            />
                        </Buttons>
                    </ListItemIcon>
                ) : null}
                <ListItemIcon>
                    <ButtonBase onClick={handleClick} >
                        {canToggle ? show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> : null}
                    </ButtonBase>
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
    thing: null,
};


Thing.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    collection: PropTypes.object.isRequired,
    info: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number,
        index: PropTypes.number,
        parentName: PropTypes.string,
        parentType: PropTypes.string,
        isParentTuple: PropTypes.bool,
    }).isRequired,

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};

export default withStores(Thing);
