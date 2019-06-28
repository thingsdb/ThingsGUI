/* eslint-disable react/no-multi-comp */
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {useStore} from '../../Stores/CollectionStore';

import Thing from './Thing';

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

const ThingRoot = ({classes}) => {
    const [store] = useStore();
    const {match, things} = store;
    
    return (
        <React.Fragment>
            <List
                component="nav"
                className={classes.root}
            >
                {Object.entries(things[match.collection.collection_id]).map(([k, v]) => k === '#' ? null : (
                    <Thing key={k} thing={v} name={k} />
                ))}
            </List>
        </React.Fragment>
    );
};

ThingRoot.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ThingRoot);