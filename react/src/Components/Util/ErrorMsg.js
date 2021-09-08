import PropTypes from 'prop-types';
import React from 'react';
import {withVlow} from 'vlow';

import LocalErrorMsg from './LocalErrorMsg';
import {ErrorActions, ErrorStore} from '../../Stores';
import {useThingsError} from '.';


const withStores = withVlow([{
    store: ErrorStore,
    keys: ['msgError']
}]);

const ErrorMsg = ({tag, msgError}) => {
    const [title, body] = useThingsError(msgError[tag]);

    React.useEffect(()=>{
        return () => {
            handleCloseError();
        };
    }, [handleCloseError]);

    const handleCloseError = React.useCallback(() => {
        ErrorActions.removeMsgError(tag);
    }, [tag]);

    return (
        <LocalErrorMsg title={title} body={body} onClose={handleCloseError} />
    );
};

ErrorMsg.propTypes = {
    msgError: ErrorStore.types.msgError.isRequired,
    tag: PropTypes.string.isRequired,

};

export default withStores(ErrorMsg);