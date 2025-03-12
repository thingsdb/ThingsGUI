import PropTypes from 'prop-types';
import React from 'react';
import Link from '@mui/material/Link';

import {ERRORS} from '../../Constants/Errors';


const parseErrorMsg = (errMsg) => {
    let errObj = {
        errMsg: errMsg,
        errCode: '',
        errLinks: [],
        errLeftover: ''
    };

    const reErrCode = /\(([-][0-9]*)\)/gi;
    const reLink = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/gi; // eslint-disable-line

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
                    <Link target="_blank" href={error.link} color="inherit">
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
                        <Link color="inherit" target="_blank" href={link}>
                            {`ThingsDocs ${link.split('/').slice(-1)}`}
                        </Link>
                    </React.Fragment>
                ))}
                {` ${errObj.errLeftover}`}
            </React.Fragment>
        )
    ]);
};

const useThingsError = (thingsError) => {
    const [title, setTitle] = React.useState<any>('');
    const [body, setBody] = React.useState<any>('');

    React.useEffect(() => {
        const [title, body] = thingsError ? parseError(thingsError) : ['', ''];
        setTitle(title);
        setBody(body);
    }, [thingsError]);

    return [title, body];
};

useThingsError.propTypes = {
    thingsError: PropTypes.string.isRequired,
};

export {
    parseError,
    useThingsError,
};