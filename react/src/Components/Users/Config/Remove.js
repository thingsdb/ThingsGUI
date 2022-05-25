import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, historyNavigate, RemoveModal } from '../../Utils';
import { ThingsdbActions } from '../../../Stores';
import { RemoveUserTAG } from '../../../Constants/Tags';


const tag = RemoveUserTAG;

const Remove = ({user}) => {
    let navigate = useNavigate();
    let location = useLocation();

    //to prevent update of name to undefined, after it is deleted.
    const [name] = React.useState(user.name); // eslint-disable-line

    const handleClickOk = () => {
        ThingsdbActions.removeUser(
            user.name,
            tag,
            () => historyNavigate(navigate, location, '/'),
        );
    };

    return(
        <RemoveModal
            buttonComponent={CardButton}
            buttonProps={{title: 'Remove'}}
            onSubmit={handleClickOk}
            tag={tag}
            title={`Remove '${name}'`}
        />
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Remove;