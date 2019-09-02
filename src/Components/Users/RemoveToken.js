import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { ThingsdbActions, useStore } from '../../Actions/ThingsdbActions';




const RemoveToken = ({token}) => {
    const dispatch = useStore()[1];
    const handleClickOk = () => {
        ThingsdbActions.delToken(dispatch, token.key);
    };

    return (
        <IconButton onClick={handleClickOk}>
            <DeleteIcon />
        </IconButton>
    );
};

RemoveToken.propTypes = {
    token: PropTypes.object.isRequired,
};

export default RemoveToken;