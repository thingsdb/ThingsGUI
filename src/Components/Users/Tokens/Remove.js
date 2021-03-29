import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import {ThingsdbActions} from '../../../Stores';
import {WarnPopover} from '../../Util';


const Remove = ({token, tag}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickOk = () => {
        ThingsdbActions.delToken(token.key, tag);
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
            <Tooltip disableFocusListener disableTouchListener title="Remove token">
                <Button color="primary" onClick={handleClick}>
                    <DeleteIcon color="primary" />
                </Button>
            </Tooltip>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} onOk={handleClickOk} description="Are you sure you want to remove this token?" />
        </React.Fragment>

    );
};

Remove.propTypes = {
    token: PropTypes.object.isRequired,
    tag: PropTypes.string.isRequired
};

export default Remove;