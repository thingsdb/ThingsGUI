import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {ApplicationActions} from '../../Stores/ApplicationStore';

const ViewCollection = ({collection}) => {

    const handleClickView = () => {
        ApplicationActions.navigate({path: 'collection', collection: collection});
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