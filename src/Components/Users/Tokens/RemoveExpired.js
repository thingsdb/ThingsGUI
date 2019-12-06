import React from 'react';
import Button from '@material-ui/core/Button';
import {ThingsdbActions} from '../../../Stores/ThingsdbStore';
import {WarnPopover} from '../../Util';

const RemoveExpired = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleClickOk = () => {
        ThingsdbActions.delExpired();
    };

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseDelete = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClick}>
                {'Remove expired '}
            </Button>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} onOk={handleClickOk} description="Are you sure you want to remove ALL expired tokens? This includes expired tokens from all users within this environment." />
        </React.Fragment>
    );
};

export default RemoveExpired;