import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {UsersActions} from '../../Stores/UsersStore';
import ServerError from '../Util/ServerError';


const Remove = ({user}) => {
    const [serverError, setServerError] = React.useState('');

    const handleClickOk = () => {
        UsersActions.removeUser(user.name, (err) => setServerError(err));
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Remove'}
            </Button>
        </React.Fragment>
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Remove;