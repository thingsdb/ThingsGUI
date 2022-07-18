import PropTypes from 'prop-types';
import React from 'react';

import { ARRAY, THING } from '../../../../Constants/ThingTypes';
import { checkType, EditProvider, fancyName, thingValue, TreeBranch } from '../../../Utils';
import { COLLECTION_SCOPE } from '../../../../Constants/Scopes';
import { CollectionActions } from '../../../../Stores/CollectionStore';
import { THING_KEY } from '../../../../Constants/CharacterKeys';
import { ThingActionsDialog } from '../TreeActions';
import ThingRestrict from './ThingRestrict';


const Thing = ({child, collection, parent, thing, things, inset}) => {
    const [show, setShow] = React.useState(false);

    // thing info

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);
    const currThing = thing && things[thing[THING_KEY]] || thing;
    const canToggle = type === 'object' || type === THING || (type === ARRAY && thing.length>0) ;

    const isTuple = type === ARRAY && parent.type === ARRAY;
    const thingId = thing && thing[THING_KEY] || parent.id;

    const handleOpenDialog = () => {
        setShow(true);
    };

    const handleCloseDialog = () => {
        setShow(false);
    };

    const onChildren = React.useCallback((k, v, i, isArray) => (
        <Thing
            inset
            collection={collection}
            things={things}
            thing={v}
            parent={{
                id: thingId,
                index: child.index,
                isTuple: isTuple,
                name: child.name,
                pname: child.pname,
                type: type,
            }}
            child={{
                index: i,
                name: fancyName(isArray ? child.name : k, i),
                pname: isArray ? child.name : k,
            }}
        />
    ), [child.name, collection, isTuple, thingId, things, type]);

    const renderChildren = () => (
        <ThingRestrict
            thing={currThing}
            onChildren={onChildren}
        />
    );

    const handleOpenClose = (open) => {
        if(thing && thing[THING_KEY]) {
            if(open) {
                CollectionActions.getThings(collection.collection_id, collection.name, thing[THING_KEY]);
            } else {
                CollectionActions.removeThing(thing[THING_KEY]);
            }
        }
    };

    return (
        <React.Fragment>
            <TreeBranch
                inset={inset}
                name={child.name}
                type={type}
                val={val}
                canToggle={canToggle}
                onRenderChildren={renderChildren}
                onOpen={handleOpenClose}
                onClick={handleOpenDialog}
            />
            {show ? (
                <EditProvider>
                    <ThingActionsDialog
                        open
                        onClose={handleCloseDialog}
                        child={{
                            id: thing ? thing[THING_KEY] : null,
                            index: child.index,
                            name: child.name,
                            pname: child.pname,
                            type: type,
                            val: val
                        }}
                        parent={parent}
                        thing={currThing}
                        scope={`${COLLECTION_SCOPE}:${collection.name}`}
                    />
                </EditProvider>
            ) : null}
        </React.Fragment>
    );
};

Thing.defaultProps = {
    thing: null,
    inset: false,
};


Thing.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    collection: PropTypes.object.isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        isTuple: PropTypes.bool,
        name: PropTypes.string,
        pname: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    child: PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
        pname: PropTypes.string,
    }).isRequired,
    things: PropTypes.object.isRequired,
    inset: PropTypes.bool,
};

export default Thing;
