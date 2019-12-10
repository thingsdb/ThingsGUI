/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {checkType, fancyName, thingValue, TreeBranch} from '../Util';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const ThingsTree = ({item, tree, child, root}) => {
    const classes = useStyles();

    // is root if item is still null
    const thing = root ? tree : item;

    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <ThingsTree
                    item={v}
                    tree={tree}
                    child={{
                        name: fancyName(k, i),
                        index: i,
                    }}
                    root={false}
                />
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([child ? `${child.name}` : `${i}`, t, i]))
            :
            Object.entries((item && tree[item['#']]) || thing || {}).map(renderThing);
    };


    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);

    // buttons
    const canToggle = (type === 'thing' && Object.keys(thing).length>1) || type === 'object' || type === 'array' || type === 'closure' || type === 'regex'|| type === 'error';

    return (
        <TreeBranch name={child.name} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} />
    );
};

ThingsTree.defaultProps = {
    item: null,
    tree: null,
};

ThingsTree.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    child: PropTypes.shape({
        name: PropTypes.string,
        index: PropTypes.number,
    }).isRequired,
    root: PropTypes.bool.isRequired,
};

export default ThingsTree;
