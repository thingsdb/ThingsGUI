/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';


import {checkType, thingValue, TreeBranch, TreeIcon} from '../Util';




const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));



const Tree = ({tree}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);

    const renderThing = ([k, v, i=null]) => { // QUEST: ???
        const infoNew = {
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
        setShow(!show);
    };

    // type and value
    const type = checkType(tree);
    const val = thingValue(type, tree);
    // buttons
    const canToggle = type === 'object' || type === 'array' || type === 'set';

    return (
        <React.Fragment>
            <ListItem className={classes.listItem}>
                <ListItemIcon>
                    <TreeIcon type={type} />
                </ListItemIcon>
                <ListItemText
                    className={classes.listItem}
                    primary={val}
                    primaryTypographyProps={{
                        display: 'block',
                        noWrap: true
                    }}
                />
                <ListItemIcon>
                    <ButtonBase onClick={handleClick} >
                        {canToggle ? show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> : null}
                    </ButtonBase>
                </ListItemIcon>
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

Tree.defaultProps = {
    tree: null,
};

Tree.propTypes = {
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default Tree;
