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



const ThingActions = ({rootId, rootName, rootType, rootThing, val, scope, info}) => {
    const classes = useStyles();

    // thing info
    const isTuple = rootType === 'array' && info.parentType === 'array';

    const fancyName = (name, index) => index !== null ? name + `[${index}]` : name;




    const handleClickOpenEditor = () => {
        ApplicationActions.navigate({path: 'query', index: 0, item: type==='object' ? `#${thingId}` : `#${thingId}.${fancyName(info.name)}`, scope: scope});
    };

    // buttons visible

    const canAdd = (type === 'array' || type === 'object' || type === 'set') && !isTuple;
    const canEdit = info.name !== '$';
    const canWatch = thing && thing.hasOwnProperty('#');

    return (
        <React.Fragment>

            <ListItemIcon>
                <Buttons>
                    {canAdd ? (
                        <AddThings
                            info={{
                                name: fancyName(info.name),
                                id: rootId,
                                type: rootType
                            }}
                            scope={scope}
                            thing={currThing}
                        />
                    ) : null}
                    {canEdit ? (
                        <EditThing
                            info={{...info, type: rootType}}
                            scope={scope}
                        />
                    ) : null}
                    <RemoveThing
                        scope={scope}
                        thing={currThing}
                        info={info}
                    />
                    {canWatch ? (
                        <WatchThings
                            scope={scope}
                            thingId={rootId}
                        />
                    ) : null}
                    <ButtonBase onClick={handleClickOpenEditor} >
                        <CodeIcon color="primary" />
                    </ButtonBase>
                </Buttons>
            </ListItemIcon>
        </React.Fragment>
    );
};

ThingActions.defaultProps = {
    thing: null,
};


ThingActions.propTypes = {
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

export default withStores(ThingActions);
