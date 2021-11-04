import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import { ErrorActions, ErrorStore } from '../../Stores';
import LocalErrorMsg from './LocalErrorMsg';


const withStores = withVlow([{
    store: ErrorStore,
    keys: ['msgError']
}]);

const ErrorMsg = ({tag, msgError}) => {

    React.useEffect(()=>{
        return () => {
            handleCloseError();
        };
    }, [handleCloseError]);

    const handleCloseError = React.useCallback(() => {
        ErrorActions.removeMsgError(tag);
    }, [tag]);

    return (
        <LocalErrorMsg msg={msgError[tag]} onClose={handleCloseError} />
    );
};

ErrorMsg.propTypes = {
    msgError: ErrorStore.types.msgError.isRequired,
    tag: PropTypes.string.isRequired,

};

export default withStores(ErrorMsg);