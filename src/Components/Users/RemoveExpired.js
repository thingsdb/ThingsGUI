import React from 'react';
import Button from '@material-ui/core/Button';
import { ThingsdbActions, useStore } from '../../Actions/ThingsdbActions';



const RemoveExpired = () => {
    const dispatch = useStore()[1];
    const handleClickOk = () => {
        ThingsdbActions.delExpired(dispatch);
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