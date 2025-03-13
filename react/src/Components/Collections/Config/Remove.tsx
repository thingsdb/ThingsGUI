import { useLocation, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';

import { historyNavigate, RemoveModal } from '../../Utils';
import { ThingsdbActions } from '../../../Stores';
import { RemoveCollectionTAG } from '../../../Constants/Tags';


const tag = RemoveCollectionTAG;

const Remove = ({collection}: Props) => {
    let navigate = useNavigate();
    let location = useLocation();
    const name = collection.name;

    const handleClickOk = () => {
        ThingsdbActions.removeCollection(
            name,
            tag,
            () => historyNavigate(navigate, location, '/'),
        );
    };

    return(
        <RemoveModal
            buttonComponent={Button}
            buttonLabel="Remove"
            buttonProps={{variant: 'outlined', color: 'primary'}}
            onSubmit={handleClickOk}
            tag={tag}
            title={name ? `Remove '${name}'` : ''}
        />
    );
};

Remove.propTypes = {

    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Remove;

interface Props {
    collection: ICollection;
}