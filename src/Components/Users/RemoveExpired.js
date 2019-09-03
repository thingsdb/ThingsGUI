import React from 'react';
import Button from '@material-ui/core/Button';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const RemoveExpired = () => {

    const handleClickOk = () => {
        ThingsdbActions.delExpired();
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