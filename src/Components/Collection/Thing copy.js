/* eslint-disable react/no-multi-comp */

import ListItemIcon from '@material-ui/core/ListItemIcon';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import CodeIcon from '@material-ui/icons/Code';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';

import AddThings from './AddThings';
import EditThing from './EditThing';
import RemoveThing from './RemoveThing';
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';
import {Buttons, checkType, thingValue, TreeBranch, WatchThings} from '../Util';


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

    // thing info
    const isTuple = type === 'array' && info.parentType === 'array';
    const thingId = thing && thing['#'] || info.id;
    const currThing = thing && things[thing['#']] || thing;
    const fancyName = (n) => info.index !== null ? n + `[${info.index}]` : n;


    const renderThing = ([k, v, i=null]) => {
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
        if (thing && thing['#']) {
            CollectionActions.query(collection, thing['#']);
        }
    };

    const handleClickOpenEditor = () => {
        ApplicationActions.navigate({path: 'query', index: 0, item: type==='object' ? `#${thingId}` : `#${thingId}.${fancyName(info.name)}`, scope:`@collection:${collection.name}`});
    };

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);

    // buttons visible
    const hasButtons = !(type === 'array' && info.name === '$' || info.name === '>' || info.isParentTuple);
    const canAdd = (type === 'array' || type === 'object' || type === 'set') && !isTuple;
    const canEdit = info.name !== '$';
    const canToggle = type === 'object' || type === 'array' || type === 'set' || type === 'closure';
    const canWatch = thing && thing.hasOwnProperty('#');

    return (
        <TreeBranch name={fancyName(info.name)} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} onClick={handleClick}>
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
                                scope={`@collection:${collection.name}`}
                                thing={currThing}
                            />
                        ) : null}
                        {canEdit ? (
                            <EditThing
                                info={{...info, type: type}}
                                scope={`@collection:${collection.name}`}
                            />
                        ) : null}
                        <RemoveThing
                            scope={`@collection:${collection.name}`}
                            thing={currThing}
                            info={info}
                        />
                        {canWatch ? (
                            <WatchThings
                                scope={`@collection:${collection.name}`}
                                thingId={thingId}
                            />
                        ) : null}
                        <ButtonBase onClick={handleClickOpenEditor} >
                            <CodeIcon color="primary" />
                        </ButtonBase>
                    </Buttons>
                </ListItemIcon>
            ) : null}
        </TreeBranch>
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
