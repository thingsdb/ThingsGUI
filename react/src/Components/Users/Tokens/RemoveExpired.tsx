import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import {ThingsdbActions} from '../../../Stores/ThingsdbStore';
import {WarnPopover} from '../../Utils';

const RemoveExpired = ({tag}: Props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleClickOk = () => {
        ThingsdbActions.delExpired(tag);
        setAnchorEl(null);
    };

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseDelete = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" color="primary" onClick={handleClick}>
                {'Remove expired '}
            </Button>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} onOk={handleClickOk} description="Are you sure you want to remove ALL expired tokens? This includes expired tokens from all users within this environment." />
        </React.Fragment>
    );
};

RemoveExpired.propTypes = {
    tag: PropTypes.string.isRequired
};

export default RemoveExpired;

interface Props {
    tag: string;
}