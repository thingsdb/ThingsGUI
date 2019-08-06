import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {UsersActions} from '../../Stores/UsersStore';


const RemoveToken = ({token, onServerError}) => {

    const handleClickOk = () => {
        UsersActions.delToken(token.key, (err) => onServerError(err));
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Remove token '}
            </Button>
        </React.Fragment>
    );
};

RemoveToken.propTypes = {
    token: PropTypes.object.isRequired,
    onServerError: PropTypes.func.isRequired,
};

export default RemoveToken;