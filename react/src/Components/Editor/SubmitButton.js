/* eslint-disable react/jsx-props-no-spreading */
import { withVlow } from 'vlow';
import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import PropTypes from 'prop-types';

import { CollectionStore } from '../../Stores';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['canSubmit']
}]);

const SubmitButton = ({canSubmit, loading, onClickSubmit}) => (
    <LoadingButton
        disabled={!canSubmit}
        onClick={onClickSubmit}
        loading={loading}
        variant="outlined"
    >
        {'Submit'}
    </LoadingButton>
);

SubmitButton.propTypes = {
    loading: PropTypes.bool.isRequired,
    onClickSubmit: PropTypes.func.isRequired,

    /* collections properties */
    canSubmit: CollectionStore.types.canSubmit.isRequired,
};

export default withStores(SubmitButton);

