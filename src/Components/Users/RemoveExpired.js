import React from 'react';
import Button from '@material-ui/core/Button';
import ThingsdbActions from '../../Actions/ThingsdbActions';

const thingsActions = new ThingsdbActions();

const RemoveExpired = () => {

    const handleClickOk = () => {
        thingsActions.delExpired();
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Remove expired '}
            </Button>
        </React.Fragment>
    );
};

export default RemoveExpired;