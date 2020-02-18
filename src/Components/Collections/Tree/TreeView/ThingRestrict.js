/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';

import ThingsBounds from './ThingsBounds';

const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    justifyContent: {
        justifyContent: 'center',
    }
}));

const visibleNumber = 200;

const ThingRestrict = ({thing, onChildren}) => {
    const classes = useStyles();

    const isArray = Array.isArray(thing);
    const [more, setMore] = React.useState({});
    const [bounds, setBounds] = React.useState({from:0, till:99});
    const {from, till} = bounds;

    const handleMore = (c) => () => {
        setMore({...more, [c]: true});
    };

    const handleBounds = (bounds) => {
        setBounds(bounds);
    };

    const renderThing = ([k, v, i=null], count) => {
        return k === '#' ? null : (
            <React.Fragment key={i ? i : k}>
                {onChildren(k, v, i, isArray)}
                {more[count] && renderChildren(count+1)}
                {!more[count] && (count+1)%visibleNumber == 0 ? (
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
        console.log(from, start)
        return (
            isArray ? thing.slice(from, till).slice(start, end).map((t, i) => renderThing([`${i}`, t, from+start+i], from+start+i)) : Object.entries(thing || {}).slice(from, till).slice(start, end).map(([k, v], i) => renderThing([k, v], from+start+i))
        );
    };


    return (
        <React.Fragment>
            {(isArray?thing.length:Object.values(thing).length)>100 && (
                <ThingsBounds onBounds={handleBounds} />
            )}
            {renderChildren()}
        </React.Fragment>
    );
};

ThingRestrict.defaultProps = {
    thing: null,
};


ThingRestrict.propTypes = {
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    onChildren:PropTypes.func.isRequired,
};

export default ThingRestrict;
