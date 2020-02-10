/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExploreIcon from '@material-ui/icons/Explore';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PropTypes from 'prop-types';
import React from 'react';

import {ThingActionsDialog} from '../TreeActions';
import {CollectionActions} from '../../../../Stores/CollectionStore';
import {checkType, fancyName, isObjectEmpty, thingValue, TreeBranch} from '../../../Util';


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
        paddingRight: theme.spacing(1),
    },
    justifyContent: {
        justifyContent: 'center',
    }
}));

const visibleNumber = 100;

const Thing = ({child, collection, parent, thing, things, watchIds}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [more, setMore] = React.useState({});

    React.useEffect(() => {
        setShow(false); // closes dialog when item of array is removed. Otherwise dialog stays open with previous item.
    },
    [JSON.stringify(thing)], // TODO STRING
    );

    // thing info

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);

    const canToggle =  type === 'thing' || (type === 'array' && thing.length>0) || type === 'closure' || type === 'regex'|| type === 'error';

    const isTuple = type === 'array' && parent.type === 'array';
    const thingId = thing && thing['#'] || parent.id;
    const currThing = thing && things[thing['#']] || thing;
    const isWatching = type === 'thing' && thing && watchIds[thing['#']];

    const hasDialog = !(parent.type === 'closure' || parent.type === 'regex' || parent.type === 'error');

    const handleOpenDialog = () => {
        setShow(true);
    };

    const handleCloseDialog = () => {
        setShow(false);
    };

    const handleMore = (c) => () => {
        setMore({...more, [c]: true});
    };

    const renderThing = ([k, v, i=null], count) => {
        return k === '#' ? null : (
            <React.Fragment key={i ? i : k}>
                <div className={classes.nested}>
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
                {more[count] && renderChildren(count+1)}
                {(count+1)%visibleNumber == 0 && !more[count] ? (
                    <ListItem className={classes.justifyContent}>
                        <Button onClick={handleMore(count)}>
                            {'LOAD MORE'}
                            <ExpandMoreIcon color="primary" />
                        </Button>
                    </ListItem>
                ):null}
            </React.Fragment>
        );
    };

    const renderChildren = (start=0) => {
        let end = start+visibleNumber;
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.slice(start, end).map((t, i) => renderThing([`${child.name}`, t, start+i], start+i))
            :
            Object.entries(currThing || {}).slice(start, end).map(([k, v], i) => renderThing([k, v], start+i));
    };

    const handleOpenClose = (open) => {
        open ? (thing && thing['#'] && CollectionActions.queryWithReturnDepth(collection, thing['#'])) : setMore({});
    };

    return (
        <React.Fragment>
            <TreeBranch name={child.name} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} onOpen={handleOpenClose} button={hasDialog} onClick={hasDialog ? handleOpenDialog : ()=>null}>
                <React.Fragment>
                    {isWatching ? (
                        <ListItemIcon>
                            <ExploreIcon className={classes.green} />
                        </ListItemIcon>
                    ) : null}
                </React.Fragment>
            </TreeBranch>
            {show ? (
                <ThingActionsDialog
                    open
                    onClose={handleCloseDialog}
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
