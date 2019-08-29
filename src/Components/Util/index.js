import Add1DArray from './Add1DArray';
import Buttons from './Buttons';
import CardButton from './CardButton';
import DrawerLayout from './DrawerLayout';
import ErrorMsg from './ErrorMsg';
import ErrorToast from './ErrorToast';
import HarmonicCard from './HarmonicCard';
import Info from './Info';
import Menu from './Menu';
import ServerError from './ServerError';
import SimpleModal from './SimpleModal';
import TableWithButtons from './TableWithButtons';
import TableWithRowExtend from './TableWithRowExtend';
import Tree from './Tree';
import TreeBranch from './TreeBranch';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
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


const buildInput = (input, type) => {
    return type === 'array' ? `[${input}]`
        : type == 'object' ? '{}'
            : type == 'string' ? `'${input}'`
                : type == 'number' || type == 'boolean' ? `${input}`
                    : type == 'set' ? 'set([])'
                        : '';
};

const buildQueryAdd = (id, name, value, type) => {
    return type==='array' ? `t(${id}).${name}.push(${value})`
        : type==='object' ? `t(${id}).${name} = ${value}`
            : type==='set' ? `t(${id}).${name}.add(${value})`
                : '';
};

const buildQueryEdit = (id, name, value, type, index) => {
    return type==='array' ? `t(${id}).${name}.splice(${index}, 1, ${value})`
        : type==='object' ? `t(${id}).${name} = ${value}`
            : type==='set' ? `t(${id}).${name}.add(${value})`
                : '';
};



export {
    Add1DArray,
    Buttons,
    buildInput,
    buildQueryAdd,
    buildQueryEdit,
    CardButton,
    checkType,
    DrawerLayout,
    ErrorMsg,
    ErrorToast,
    HarmonicCard,
    Info,
    Menu,
    onlyNums,
    ServerError,
    SimpleModal,
    TableWithButtons,
    TableWithRowExtend,
    Tree,
    TreeBranch,
    QueryInput,
    QueryOutput,
    StyledTabs,
    StyledTab
};