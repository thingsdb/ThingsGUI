import { styled } from '@mui/material/styles';
import { withVlow } from 'vlow';
import React from 'react';

import { ErrorStore } from '../../Stores';
import { ErrorToastCard } from '.';

const Portal = styled('div')(() => ({
    position: 'absolute',
    bottom: '1%',
    right: '1%',
    width: '400px',
    zIndex: 3000,
}));

const withStores = withVlow([{
    store: ErrorStore,
    keys: ['toastErrors']
}]);


const ErrorToast = ({toastErrors}) => (
    <Portal>
        <ul>
            {[...toastErrors].map((err, i) => <ErrorToastCard key={`error_toast_card_${i}`} index={i} thingsError={err} />)}
        </ul>
    </Portal>
);

ErrorToast.propTypes = {
    toastErrors: ErrorStore.types.toastErrors.isRequired,
};

export default withStores(ErrorToast);

