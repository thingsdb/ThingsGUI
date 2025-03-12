import { withVlow } from 'vlow';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import { useEdit } from '../../../Utils';
import { CollectionStore } from '../../../../Stores';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['canSubmit']
}]);


const SubmitButton = ({canSubmit, onClickSubmit}) => {
    const editState = useEdit()[0];
    const {query, blob, error} = editState;

    const handleClickOk = () => {
        onClickSubmit(blob, query);
    };

    return (
        <Button onClick={handleClickOk} disabled={!canSubmit || Boolean(error)} color="primary">
            {'Submit'}
        </Button>
    );
};

SubmitButton.propTypes = {
    onClickSubmit: PropTypes.func.isRequired,

    /* collections properties */
    canSubmit: CollectionStore.types.canSubmit.isRequired,
};

export default withStores(SubmitButton);

