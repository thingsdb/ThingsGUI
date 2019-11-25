/* eslint-disable react/no-multi-comp */
import ExploreIcon from '@material-ui/icons/Explore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PropTypes from 'prop-types';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import ThingActionsDialog from './ThingActionsDialog';
import {CollectionActions} from '../../Stores/CollectionStore';
import {checkType, fancyName, thingValue, TreeBranch} from '../Util';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
    green: {
        color: theme.palette.primary.green,
    },
}));



const Thing = ({thing, collection, things, parent, child, watchIds}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);


    React.useEffect(() => {
        setShow(false); // closes dialog when item of array is removed. Otherwise dialog stays open with previous item.
    },
    [JSON.stringify(thing)],
    );

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    // thing info

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);

    const canToggle = type === 'thing' || type === 'array' || type === 'closure' || type === 'regex'|| type === 'error';

    const isTuple = type === 'array' && parent.type === 'array';
    const thingId = thing && thing['#'] || parent.id;
    const currThing = thing && things[thing['#']] || thing;
    const isWatching = type === 'thing' && watchIds && watchIds.hasOwnProperty([`@collection:${collection.name}`]) && watchIds[`@collection:${collection.name}`].includes(`${thing && thing['#']}`);

    const hasActions = !(parent.type === 'closure' || parent.type === 'regex' || parent.type === 'error');

    const renderThing = ([k, v, i=null]) => {
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <Thing
                    collection={collection}
                    things={things}
                    thing={v}
                    parent={{
                        id: thingId,
                        name: child.name,
                        type: type,
                        isTuple: isTuple,
                    }}
                    child={{
                        name: fancyName(k, i),
                        index: i,
                    }}
                    watchIds={watchIds}
                />
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([`${child.name}`, t, i]))
            :
            Object.entries(currThing || {}).map(renderThing);
    };

    const handleClick = () => {
        if (thing && thing['#']) {
            CollectionActions.queryWithReturnDepth(collection, thing['#']);
        }
    };

    return (
        <React.Fragment>
            <TreeBranch name={child.name} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} onClick={handleClick} button={hasActions} onAction={hasActions ? handleClickOpen : ()=>null}>
                <React.Fragment>
                    {isWatching ? (
                        <ListItemIcon className={classes.icon}>
                            <ExploreIcon className={classes.green} />
                        </ListItemIcon>
                    ) : null}
                    {/* <ListItemIcon>
                        <ThingActions
                            child={{
                                id: thing && thing['#']||null,
                                index: child.index,
                                name: child.name,
                                type: type,
                            }}
                            parent={parent}
                            thing={currThing}
                            scope={`@collection:${collection.name}`}
                        />
                    </ListItemIcon> */}
                </React.Fragment>
            </TreeBranch>
            {show ? (
                <ThingActionsDialog
                    open={show}
                    onClose={handleClickClose}
                    child={{
                        id: thing && thing['#']||null,
                        index: child.index,
                        name: child.name,
                        type: type,
                    }}
                    parent={parent}
                    thing={currThing}
                    scope={`@collection:${collection.name}`}
                />
            ) : null}
        </React.Fragment>
    );
};

Thing.defaultProps = {
    thing: null,
};


Thing.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    collection: PropTypes.object.isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    child: PropTypes.shape({
        name: PropTypes.string,
        index: PropTypes.number,
    }).isRequired,
    things: PropTypes.object.isRequired,
    watchIds: PropTypes.object.isRequired,
};

export default Thing;
