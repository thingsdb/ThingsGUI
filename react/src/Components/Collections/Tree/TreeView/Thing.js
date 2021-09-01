import PropTypes from 'prop-types';
import React from 'react';

import {EditProvider} from '../../CollectionsUtils';
import ThingRestrict from './ThingRestrict';
import {ThingActionsDialog} from '../TreeActions';
import {CollectionActions} from '../../../../Stores/CollectionStore';
import {checkType, fancyName, thingValue, TreeBranch} from '../../../Util';
import {THING_KEY} from '../../../../Constants/CharacterKeys';
import {ARRAY, THING} from '../../../../Constants/ThingTypes';
import {COLLECTION_SCOPE} from '../../../../Constants/Scopes';


const Thing = ({child, collection, parent, thing, things, inset}) => {
    const [show, setShow] = React.useState(false);

    // thing info

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);
    const currThing = thing && things[thing[THING_KEY]] || thing;
    const canToggle =  type === THING || (type === ARRAY && thing.length>0) ;

    const isTuple = type === ARRAY && parent.type === ARRAY;
    const thingId = thing && thing[THING_KEY] || parent.id;

    const handleOpenDialog = () => {
        setShow(true);
    };

    const handleCloseDialog = () => {
        setShow(false);
    };

    const renderChildren = () => {
        return (
            <ThingRestrict
                thing={currThing}
                onChildren={(k, v, i, isArray) => (
                    <Thing
                        inset
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
                            name: fancyName(isArray?child.name:k, i),
                            index: i,
                        }}
                    />
                )}
            />
        );
    };

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
            <TreeBranch inset={inset} name={child.name} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} onOpen={handleOpenClose} onClick={handleOpenDialog} />
            {show ? (
                <EditProvider>
                    <ThingActionsDialog
                        open
                        onClose={handleCloseDialog}
                        child={{
                            id: thing ? thing[THING_KEY] : null,
                            index: child.index,
                            name: child.name,
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
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    child: PropTypes.shape({
        name: PropTypes.string,
        index: PropTypes.number,
    }).isRequired,
    things: PropTypes.object.isRequired,
    inset: PropTypes.bool,
};

export default Thing;
