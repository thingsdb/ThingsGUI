import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {useStore} from '../../Stores/ApplicationStore';

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

export default ViewCollection;