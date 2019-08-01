import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import  {UsersActions} from '../../Stores/UsersStore';


const Revoke = ({user, target, privileges, onServerError}) => {

    const handleClickOk = () => {
        UsersActions.revoke(
            user.name, 
            target, 
            privileges, 
            (err) => onServerError(err)
        );
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Revoke'}
            </Button>
        </React.Fragment>
    );
};

Revoke.propTypes = {
    user: PropTypes.object.isRequired,
    target: PropTypes.string.isRequired,
    privileges: PropTypes.string.isRequired, // TODOK
    onServerError: PropTypes.func.isRequired, 
};

export default Revoke;