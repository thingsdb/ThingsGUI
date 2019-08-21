import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const RemoveExpired = ({onServerError}) => {

    const handleClickOk = () => {
        ThingsdbActions.delExpired((err) => onServerError(err));
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Remove expired '}
            </Button>
        </React.Fragment>
    );
};

RemoveExpired.propTypes = {
    onServerError: PropTypes.func.isRequired,
};

export default RemoveExpired;