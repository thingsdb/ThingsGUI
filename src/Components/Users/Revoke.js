import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import  {UsersActions} from '../../Stores/UsersStore';


const Revoke = ({user, target, privileges}) => {
    const [serverError, setServerError] = React.useState('');

    const handleClickOk = () => {
        UsersActions.revoke(
            user.name, 
            target, 
            privileges, 
            (err) => setServerError(err)
        );
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Revoke'}
            </Button>
        </React.Fragment>
    );
};

Revoke.propTypes = {
    user: PropTypes.object.isRequired,
    target: PropTypes.string.isRequired,
    privileges: PropTypes.string.isRequired, // TODOK
};

export default Revoke;