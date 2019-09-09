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
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';


import {checkType, thingValue, TreeIcon} from '../Util';




const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));



const TreeBranch = ({item, tree, info}) => {
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
        const isArray = Array.isArray(item);
        return isArray ?
            item.map((t, i) => renderThing([`${info.name}`, t, i]))
            :
            Object.entries((item && tree[item['#']]) || item || {}).map(renderThing);
    };

    const handleClick = () => {
        setShow(!show);
    };

    // type and value
    const type = checkType(item);
    const val = thingValue(type, item);
    // buttons
    const canToggle = type === 'object' || type === 'array' || type === 'set';

    // naming
    const fancyName = (n) => info.index !== null ? n + `[${info.index}]` : n;

    return (
        <React.Fragment>
            <ListItem className={classes.listItem}>
                <ListItemIcon>
                    <TreeIcon type={type} />
                </ListItemIcon>
                <ListItemText
                    className={classes.listItem}
                    primary={info ? (
                        <React.Fragment>
                            <Typography
                                variant="body1"
                                color="primary"
                                component="span"
                            >
                                {fancyName(info.name)}
                            </Typography>
                            {`  -   ${val}`}
                        </React.Fragment>
                    ) : val}
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

TreeBranch.defaultProps = {
    item: null,
};

TreeBranch.propTypes = {
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    tree: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    info: PropTypes.object.isRequired,
};

export default TreeBranch;
