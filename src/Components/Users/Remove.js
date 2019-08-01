import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {UsersActions} from '../../Stores/UsersStore';

const Remove = ({user, onServerError}) => { // TODO dialog are u sure?

    const handleClickOk = () => {
        UsersActions.removeUser(user.name, (err) => onServerError(err));
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Remove'}
            </Button>
        </React.Fragment>
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
    onServerError: PropTypes.func.isRequired, 
};

export default Remove;