import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';

import {THING_KEY} from '../../../../Constants/CharacterKeys';
import ThingsBounds from './ThingsBounds';

const useStyles = makeStyles(() => ({
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

    const handleBounds = React.useCallback((bounds) => {
        setBounds(bounds);
    }, []);

    const renderThing = ([k, v, i=null], count) => {
        return(
            <React.Fragment key={i ? i : k}>
                {onChildren(k, v, i, isArray)}
                {more[count] && renderChildren(count+1)}
                {!more[count] && (count+1)%visibleNumber == 0 ? (
                    <ListItem className={classes.justifyContent}>
                        <Button color="primary" onClick={handleMore(count)}>
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
        return (
            isArray ? thing.slice(from, till).slice(start, end).map((t, i) => renderThing([`${i}`, t, from+start+i], start+i)) : Object.keys(thing || {}).reduce((res, k) => {k !== THING_KEY && res.push([k, thing[k]]); return res;},[]).slice(from, till).slice(start, end).map(([k, v], i) => renderThing([k, v], start+i))
        );
    };


    return (
        <React.Fragment>
            {(isArray?thing.length:Object.values(thing).length)>100 && (
                <ThingsBounds onChange={handleBounds} total={isArray?thing.length:Object.keys(thing).length} />
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