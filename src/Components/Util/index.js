import Add1DArray from './Add1DArray';
import Buttons from './Buttons';
import ErrorToast from './ErrorToast';
import ServerError from './ServerError';
import TableWithButtons from './TableWithButtons';
import TableWithRowExtend from './TableWithRowExtend';
import {StyledTabs, StyledTab} from './Tabs';

const checkType = (t) => {
    let type = typeof(t);
    if (type === 'object') {
        type = Array.isArray(t) ? 'array' : 'object';
        if (type === 'object') {
            const kindOfObject = Object.keys(t)[0];
            type = kindOfObject === '#' ? 'object' : (kindOfObject === '$' ? 'set' : null );
        }
    }
    return(type);
};
const onlyNums = (str) => str.length == str.replace(/[^0-9.,]/g, '').length;

export {
    Add1DArray,
    Buttons,
    checkType,
    ErrorToast,
    onlyNums,
    ServerError,
    TableWithButtons,
    TableWithRowExtend,
    StyledTabs,
    StyledTab
};