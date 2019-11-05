/* eslint-disable react/no-multi-comp */

import ListItemIcon from '@material-ui/core/ListItemIcon';
import PropTypes from 'prop-types';
import React from 'react';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';

import ThingActions from './ThingActions';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import {checkType, fancyName, thingValue, TreeBranch} from '../Util';


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



const Thing = ({thing, collection, things, parent, child}) => {
    const classes = useStyles();

    // thing info

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);

    const canToggle = type === 'thing' || type === 'array' || type === 'set' || type === 'closure';

    const isTuple = type === 'array' && parent.type === 'array';
    const thingId = thing && thing['#'] || parent.id;
    const currThing = thing && things[thing['#']] || thing;


    const renderThing = ([k, v, i=null]) => {
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <Thing
                    collection={collection}
                    things={things}
                    thing={v}
                    parent={{
                        id: thingId,
                        name: child.name == '$' ? parent.name : child.name,
                        type: type,
                        isTuple: isTuple,
                    }}
                    child={{
                        name: fancyName(k, i),
                        index: i,
                    }}
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
            CollectionActions.query(collection, thing['#']);
        }
    };

    const hasActions = !(child.name == '$');

    return (
        <TreeBranch name={child.name} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} onClick={handleClick}>
            {hasActions ? (
                <ListItemIcon>
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
                </ListItemIcon>
            ): null}
        </TreeBranch>
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

    /* collection properties */
    things: CollectionStore.types.things.isRequired,
};

export default withStores(Thing);
