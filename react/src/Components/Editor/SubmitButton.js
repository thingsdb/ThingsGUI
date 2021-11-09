/* eslint-disable react/jsx-props-no-spreading */
import { withVlow } from 'vlow';
import * as React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

import { CollectionStore } from '../../Stores';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['canSubmit']
}]);

const SubmitButton = ({canSubmit, onClickSubmit}) => (
    <Button disabled={!canSubmit} onClick={onClickSubmit}>
        {'Submit'}
    </Button>
);

SubmitButton.propTypes = {
    onClickSubmit: PropTypes.func.isRequired,

    /* collections properties */
    canSubmit: CollectionStore.types.canSubmit.isRequired,
};

export default withStores(SubmitButton);

