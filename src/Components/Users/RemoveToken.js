import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const RemoveToken = ({token}) => {

    const handleClickOk = () => {
        ThingsdbActions.delToken(token.key);
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