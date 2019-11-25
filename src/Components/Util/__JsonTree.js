/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {checkType, thingValue, JsonBranch} from '.';


const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const JsonTree = ({item, tree, child}) => {
    const classes = useStyles();
    console.log('jsontree');

    // is root if item is still null
    const thing = item === null ? tree : item;

    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <JsonTree
                    item={v}
                    tree={tree}
                    child={{
                        name: i ? null : k,
                        index: i,
                    }}
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
    const canToggle = type === 'thing' || type === 'object' || type === 'array';

    return (
        <JsonBranch name={child.name} type={type} val={val} onRenderChildren={canToggle ? renderChildren : null} />
    );
};

JsonTree.defaultProps = {
    item: null,
};

JsonTree.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    child: PropTypes.shape({
        name: PropTypes.string,
        index: PropTypes.number,
    }).isRequired,
};

export default JsonTree;
