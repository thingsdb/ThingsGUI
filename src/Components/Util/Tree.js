/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StopIcon from '@material-ui/icons/Stop';
import PropTypes from 'prop-types';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';


import {checkType, TreeBranch} from '../Util';




const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        paddingLeft: theme.spacing(6),
    },
}));



const Tree = ({tree}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);

    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        const infoNew = i==null ? {
            name: k,
        } : {
            name: k,
            index: i,
        };
        return k === '#' ? null : (
            <div key={i ? i : k} className={classes.nested}>
                <TreeBranch
                    item={v}
                    tree={tree}
                    info={infoNew}
                />
            </div>
        );
    };

    const renderChildren = () => {
        const isArray = Array.isArray(tree);
        return isArray ?
            tree.map((t, i) => renderThing([i.toString(), t, i]))
            :
            Object.entries(tree || {}).map(renderThing);
    };

    const handleClick = () => {
        setShow(!show); // QUEST: work with prevstate?
    };

    const type = checkType(tree);
    const canToggle = type === 'object' || type === 'array' || type === 'set';
    const objectId = type === 'object' ? tree['#'] : '';
    const key = Object.keys(tree)[0];
    const val = type === 'array' ? `[${tree.length}]`
        : type === 'object' || type === 'set' ? `{${key}${objectId}}`
            : type === 'string' || type === 'number' || type === 'boolean' ? tree.toString()
                : '';

    return (
        <React.Fragment>
            <ListItem>
                <ListItemIcon>
                    <ButtonBase onClick={handleClick} >
                        {canToggle ? show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> : <StopIcon color="primary" />}
                    </ButtonBase>
                </ListItemIcon>
                <ListItemText secondary={val} />
            </ListItem>
            {canToggle &&
            <Collapse in={show} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                    {renderChildren()}
                </List>
            </Collapse>}
        </React.Fragment>
    );
};

Tree.propTypes = {
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
};

export default Tree;
