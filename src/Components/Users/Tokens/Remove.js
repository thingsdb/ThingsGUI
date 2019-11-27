import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import {ThingsdbActions} from '../../../Stores';


const Remove = ({token}) => {

    const handleClickOk = () => {
        ThingsdbActions.delToken(token.key);
    };

    return (
        <IconButton onClick={handleClickOk}>
            <DeleteIcon />
        </IconButton>
    );
};

Remove.propTypes = {
    token: PropTypes.object.isRequired,
};

export default Remove;