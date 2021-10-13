import { withVlow } from 'vlow';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import { CollectionStore } from '../../Stores';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['canSubmit']
}]);


const SubmitButton = ({canSubmit, onClickSubmit}) => (
    <Button onClick={onClickSubmit} disabled={!canSubmit} color="primary">
        {'Submit'}
    </Button>
);

SubmitButton.propTypes = {
    onClickSubmit: PropTypes.func.isRequired,

    /* collections properties */
    canSubmit: CollectionStore.types.canSubmit.isRequired,
};

export default withStores(SubmitButton);

