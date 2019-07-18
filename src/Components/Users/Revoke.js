import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import  {useUsers, UsersActions} from '../../Stores/UsersStore';


const Revoke = ({user, target, privileges}) => {
    const [store, dispatch] = useUsers(); // eslint-disable-line no-unused-vars

    const revoke = React.useCallback(UsersActions.revoke(dispatch, user.name, target, privileges));

    const handleClickOk = () => {
        revoke();
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