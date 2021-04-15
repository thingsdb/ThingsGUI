import PropTypes from 'prop-types';
import React from 'react';
import Link from '@material-ui/core/Link';
import {withVlow} from 'vlow';

import LocalErrorMsg from './LocalErrorMsg';
import { ErrorActions, ErrorStore } from '../../Stores';
import {ERRORS} from '../../Constants/Errors';


const withStores = withVlow([{
    store: ErrorStore,
    keys: ['msgError']
}]);


const parseErrorMsg = (errMsg) => {
    let errObj = {
        errMsg: errMsg,
        errCode: '',
        errLinks: [],
        errLeftover: ''
    };

    let reErrCode = /\(([-][0-9]*)\)/gi;
    let reLink = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/gi;

    // Get error code
    let res1;
    if((res1 = reErrCode.exec(errMsg)) !== null){
        errObj.errCode = res1[1];
    }

    // Get links
    let res2;
    let prevLastIndex = reErrCode.lastIndex;
    while ((res2 = reLink.exec(errMsg)) !== null) {
        errObj.errLinks.push({
            link: res2[0],
            preLink: errMsg.slice(prevLastIndex, res2.index),
        });

        prevLastIndex = reLink.lastIndex;
    }

    errObj.errLeftover= errObj.errLinks.slice(-1).postLink = errMsg.slice(prevLastIndex);

    return errObj;
};

const parseError = (errMsg) => {
    const errObj = parseErrorMsg(errMsg);
    const error = ERRORS[errObj.errCode];
    return([
        (
            <React.Fragment key="error_title">
                {error ? (
                    <Link target="_blank" href={error.link}>
                        {error.label}
                    </Link>
                ) : errObj.errCode ? `(${errObj.errCode}) `
                    : ''}
            </React.Fragment>
        ),
        (
            <React.Fragment key="error_body">
                {errObj.errLinks.map(({link, preLink}) => (
                    <React.Fragment key={`err_${link}$`}>
                        {`${preLink} `}
                        <Link target="_blank" href={link}>
                            {`ThingsDocs ${link.split('/').slice(-1)}`}
                        </Link>
                    </React.Fragment>
                ))}
                {` ${errObj.errLeftover}`}
            </React.Fragment>
        )
    ]);
};

const ErrorMsg = ({tag, msgError}) => {
    const msg = msgError[tag];
    const [title, body] = React.useMemo(() => msg ? parseError(msg) : ['', ''], [msg]);

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