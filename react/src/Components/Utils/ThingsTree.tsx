import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import { checkType, fancyName, thingValue, TreeBranch } from '.';
import { SET_KEY, THING_KEY } from '../../Constants/CharacterKeys';
import { ARRAY, SET, THING } from '../../Constants/ThingTypes';


const Nested = styled('div')(({theme}) => ({
    paddingLeft: theme.spacing(4),
}));

const visibleNumber = 100;

const ThingsTree = ({
    child,
    customTypes = [],
    item = null,
    root,
    tree = null,
    onAction = null,
}: Props) => {
    const [more, setMore] = React.useState<any>({});

    // is root if item is still null
    const thing = root ? tree : item;

    const handleMore = (c: number) => () => {
        setMore({...more, [c]: true});
    };

    const renderThing = ([k, v, i=null]: any, count: number) => {
        return k === THING_KEY ? null : (
            <React.Fragment key={i ? i : k}>
                <Nested>
                    <ThingsTree
                        item={v}
                        tree={tree}
                        child={{
                            name: fancyName(k, i),
                            index: i,
                        }}
                        root={false}
                        customTypes={customTypes}
                        onAction={onAction}
                    />
                </Nested>
                {more[count] && renderChildren(count+1)}
                {(count+1)%visibleNumber == 0 && !more[count] ? (
                    <Grid container alignItems="center" justifyContent="center" size={12}>
                        <Grid>
                            <Button color="primary" onClick={handleMore(count)}>
                                {'LOAD MORE'}
                                <ExpandMoreIcon color="primary" />
                            </Button>
                        </Grid>
                    </Grid>
                ):null}
            </React.Fragment>
        );
    };

    const renderChildren = (start=0) => {
        let end = start+visibleNumber;
        const t = type == SET ? thing[SET_KEY] : thing;
        const isArray = Array.isArray(t);

        return isArray ?
            t.slice(start, end).map((t, i) => renderThing([child ? `${child.name}` : `${i}`, t, start+i], start+i))
            :
            Object.entries(t || {}).slice(start, end).map(([k, v], i) => renderThing([k, v], start+i));
    };

    const handleOpenClose = (open: boolean) => {
        !open&&setMore({});
    };

    // type and value
    const type = checkType(thing);
    const val = thingValue(type, thing, customTypes);

    // buttons
    const canToggle = type === 'object' || (type === THING && Object.keys(thing).length>1) || (type === ARRAY && thing.length>0) || (type === SET && thing[SET_KEY].length>0);

    return (
        <TreeBranch name={child.name} type={type} val={val} canToggle={canToggle} onOpen={handleOpenClose} onRenderChildren={renderChildren} onAction={onAction} />
    );
};

ThingsTree.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    child: PropTypes.shape({
        name: PropTypes.string,
        index: PropTypes.number,
    }).isRequired,
    onAction: PropTypes.func,
    root: PropTypes.bool.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ThingsTree;


interface Props {
    item: any;
    tree: any;
    child: {
        name: string;
        index: number;
    };
    onAction?: any;  // (name: string, type: string, val: string) => void;
    root: boolean;
    customTypes?: IType[];
}
