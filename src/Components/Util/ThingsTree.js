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


const ThingsTree = ({item, tree, info}) => {
    const classes = useStyles();

    // is root if info is still null
    const thing = info === null ? tree : item;

    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        const infoNew = {
            name: k,
            index: i,
        };
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <ThingsTree
                    item={v}
                    tree={tree}
                    info={infoNew}
                />
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => renderThing([info ? `${info.name}` : `${i}`, t, i]))
            :
            Object.entries((item && tree[item['#']]) || thing || {}).map(renderThing);
    };


    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing);
    // buttons
    const canToggle = type === 'object' || type === 'array' || type === 'set';

    // naming
    const fancyName = (n) => info.index !== null ? n + `[${info.index}]` : n;
    const name = info && fancyName(info.name);

    return (
        <TreeBranch name={name} type={type} val={val} canToggle={canToggle} onRenderChildren={renderChildren} />
    );
};

ThingsTree.defaultProps = {
    item: null,
    info: null,
};

ThingsTree.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    info: PropTypes.object,
};

export default ThingsTree;
