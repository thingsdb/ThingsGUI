import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import { ErrorActions, ErrorStore } from '../../Stores';
import LocalErrorMsg from './LocalErrorMsg';


const withStores = withVlow([{
    store: ErrorStore,
    keys: ['msgError']
}]);

const ErrorMsg = ({tag, msgError}: IErrorStore & Props) => {

    // TODO: strange bug in placement of useCallback function to useEffect.
    // When placing the Callback underneath the useEffect, it becomes stale, no changes in the Callback are detected.
    // After placing it here, everything works as expected.
    // NOTE: This bug was not detected here but at other place in the code; however that useCallback+useEffect was deleted.
    // The comment is placed here, as the code has a similar structure.
    const handleCloseError = React.useCallback(() => {
        ErrorActions.removeMsgError(tag);
    }, [tag]);

    React.useEffect(()=>{
        return () => {
            handleCloseError();
        };
    }, [handleCloseError]);

    return (
        <LocalErrorMsg msg={msgError[tag]} onClose={handleCloseError} />
    );
};

ErrorMsg.propTypes = {
    msgError: ErrorStore.types.msgError.isRequired,
    tag: PropTypes.string.isRequired,

};

export default withStores(ErrorMsg);

interface Props {
    tag: string;
}