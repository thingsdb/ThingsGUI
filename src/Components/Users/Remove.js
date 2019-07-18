import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {useUsers, UsersActions} from '../../Stores/UsersStore';


const Remove = ({user}) => {
    const [store, dispatch] = useUsers(); // eslint-disable-line no-unused-vars

    const remove = React.useCallback(UsersActions.removeUser(dispatch, user.name));

    const handleClickOk = () => {
        remove();
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