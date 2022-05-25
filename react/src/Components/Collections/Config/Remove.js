import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';

import { historyNavigate, RemoveModal } from '../../Utils';
import { ThingsdbActions } from '../../../Stores';
import { RemoveCollectionTAG } from '../../../Constants/Tags';


const tag = RemoveCollectionTAG;

const Remove = ({collection}) => {
    let navigate = useNavigate();
    let location = useLocation();

    //to prevent update of name to undefined, after it is deleted.
    const [name] = React.useState(collection.name); // eslint-disable-line

    const handleClickOk = () => {
        ThingsdbActions.removeCollection(
            collection.name,
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
            title={`Remove '${name}'`}
        />
    );
};

Remove.propTypes = {

    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Remove;