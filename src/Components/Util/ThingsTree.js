/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {checkType, thingValue, TreeBranch} from '../Util';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const ThingsTree = ({item, tree, child, parent}) => {
    const classes = useStyles();

    // is root if parent is still null
    const thing = parent === null ? tree : item;

    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <ThingsTree
                    item={v}
                    tree={tree}
                    parent={{
                        name: k,
                    }}
                    child={{
                        index: i,
                    }}
                />
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([parent ? `${parent.name}` : `${i}`, t, i]))
            :
            Object.entries((item && tree[item['#']]) || thing || {}).map(renderThing);
    };


    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);
    // buttons
    const canToggle = type === 'object' || type === 'array' || type === 'set';

    // naming
    const fancyName = (n) => child.index !== null ? n + `[${child.index}]` : n;
    const name = parent && fancyName(parent.name);

    return (
        <TreeBranch name={name} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} />
    );
};

ThingsTree.defaultProps = {
    item: null,
    child: null,
    parent: null,
};

ThingsTree.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    child: PropTypes.shape({
        index: PropTypes.number,
    }),
    parent: PropTypes.shape({
        name: PropTypes.string,
    }),
};

export default ThingsTree;
