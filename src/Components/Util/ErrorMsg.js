/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */

import PropTypes from 'prop-types';
import React from 'react';
import Link from '@material-ui/core/Link';
import {withVlow} from 'vlow';

import LocalErrorMsg from './LocalErrorMsg';
import { ErrorActions, ErrorStore } from '../../Stores';


const withStores = withVlow([{
    store: ErrorStore,
    keys: ['msgError']
}]);

const ErrorMsg = ({tag, msgError}) => {

    React.useEffect(()=>{
        return () => handleCloseError();
    }, []);

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const link = (msgErr) => {
        const startIndex = msgErr.search(/https/);
        const length = msgErr.slice(startIndex).search(/;/);
        if (length!=-1&&length!=0) {
            return(
                <React.Fragment>
                    {msgErr.slice(0, startIndex)}
                    <Link href={msgErr.slice(startIndex, startIndex+length)}>
                        {msgErr.slice(startIndex, startIndex+length)}
                    </Link>
                    {msgErr.includes('https', startIndex+length) ? link(msgErr.slice(startIndex+length)):msgErr.slice(startIndex+length)}
                </React.Fragment>
            );
        } else {
            return(
                <React.Fragment>
                    {msgErr.slice(0, startIndex)}
                    <Link href={msgErr.slice(startIndex)}>
                        {msgErr.slice(startIndex)}
                    </Link>
                </React.Fragment>
            );
        }
    };


    return (
        <LocalErrorMsg msgError={msgError[tag] && msgError[tag].includes('https') ? link(msgError[tag]): msgError[tag]} onClose={handleCloseError} />
    );
};

ErrorMsg.propTypes = {
    msgError: ErrorStore.types.msgError.isRequired,
    tag: PropTypes.string.isRequired,

};

export default withStores(ErrorMsg);