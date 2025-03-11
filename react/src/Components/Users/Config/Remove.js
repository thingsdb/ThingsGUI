import { useLocation, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, historyNavigate, RemoveModal } from '../../Utils';
import { ThingsdbActions } from '../../../Stores';
import { RemoveUserTAG } from '../../../Constants/Tags';


const tag = RemoveUserTAG;

const Remove = ({user}) => {
    let navigate = useNavigate();
    let location = useLocation();
    const name = user.name;

    const handleClickOk = () => {
        ThingsdbActions.removeUser(
            name,
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
            title={name ? `Remove '${name}'`: ''}
        />
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Remove;