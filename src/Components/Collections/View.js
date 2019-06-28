import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {useStore} from '../../Stores/ApplicationStore';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const ViewCollection = ({collection}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line
    
    const handleClickView = () => {
        dispatch(() => ({match: {path: 'collection', collection}}));
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickView}>
                {'View'}
            </Button>
        </React.Fragment>
    );
};

ViewCollection.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewCollection);