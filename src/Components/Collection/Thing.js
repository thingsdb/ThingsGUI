import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import FolderIcon from '@material-ui/icons/Folder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import {CollectionStore, CollectionActions} from '../../Stores/CollectionStore';

const withStores = withVlow({
    store: CollectionStore,
    keys: ['things'],
});

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class Thing extends React.Component {
    state = {
        opened: null,
    };

    renderThing = ([k, v]) => {
        const {classes} = this.props;
        return (
            <div key={k} className={classes.nested}>
                <ThingWrapped thing={v} name={k} />
            </div>
        );
    }

    renderChildren = () => {
        const {thing, things} = this.props;

        const isArray = Array.isArray(thing);
        return isArray ?
            thing.map((t, i) => this.renderThing([i.toString(), t]))
            :
            Object.entries(things[thing['#']] || {}).map(this.renderThing);
    }

    handleClick = () => {
        const {thing, things} = this.props;

        this.setState(state => ({opened: !state.opened}));
        if (thing && thing['#'] && !things[thing['#']]) {
            CollectionActions.queryThing(thing['#']);
        }
    };

    render() {
        const {name, thing} = this.props;
        const {opened} = this.state;

        const canToggle = typeof(thing) === 'object';
        const val = canToggle ? Array.isArray(thing) ? `[${thing.length}]` : '{}' : thing.toString();

        return (
            <React.Fragment>
                <ListItem button onClick={this.handleClick}>
                    <ListItemText primary={name} secondary={val} />
                    {canToggle ? opened ? <ExpandLess /> : <ExpandMore /> : null}
                </ListItem>
                {canToggle &&
                <Collapse in={opened} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {this.renderChildren()}
                    </List>
                </Collapse>}
            </React.Fragment>
        );
    }
}

Thing.propTypes = {
    classes: PropTypes.object.isRequired,
    things: CollectionStore.types.things.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
};

const ThingWrapped = withStores(withStyles(styles)(Thing));

export default ThingWrapped;