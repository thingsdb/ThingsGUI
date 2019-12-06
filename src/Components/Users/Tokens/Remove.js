import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import {ThingsdbActions} from '../../../Stores';
import {WarnPopover} from '../../Util';


const Remove = ({token}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickOk = () => {
        ThingsdbActions.delToken(token.key);
    };

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseDelete = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleClick}>
                <DeleteIcon />
            </IconButton>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} onOk={handleClickOk} description="Are you sure you want to remove this token?" />
        </React.Fragment>

    );
};

Remove.propTypes = {
    token: PropTypes.object.isRequired,
};

export default Remove;