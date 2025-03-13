/* eslint-disable react/jsx-props-no-spreading */
import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import { CollectionStore } from '../../Stores';
import { SendButton } from '../Utils';

const withStores = withVlow([{
    store: CollectionStore,
    keys: ['canSubmit']
}]);

const SubmitButton = ({canSubmit, loading, onClickSubmit}: ICollectionStore & Props) => (
    <SendButton
        disabled={!canSubmit}
        label="Submit"
        loading={loading}
        onClickSend={onClickSubmit}
    />
);

SubmitButton.propTypes = {
    loading: PropTypes.bool.isRequired,
    onClickSubmit: PropTypes.func.isRequired,

    /* collections properties */
    canSubmit: CollectionStore.types.canSubmit.isRequired,
};

export default withStores(SubmitButton);


interface Props {
    loading: boolean;
    onClickSubmit: () => void;
}