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
import ThingsTree from './ThingsTree';
import TopBarMenu from './TopBarMenu';
import TreeBranch from './TreeBranch';
import TreeIcon from './TreeIcon';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
import {StyledTabs, StyledTab} from './Tabs';

const checkType = (t) => {
    if (t === null || t === 'nil') {
        return('nil');
    }
    let type = typeof(t);
    if (type === 'object') {
        type = Array.isArray(t) ? 'array' : 'object';
        if (type === 'object') {
            const kindOfObject = Object.keys(t)[0];
            type = kindOfObject === '#' ? 'object'
                : kindOfObject === '$' ? 'set' : 'object' ; // todo maak onderscheid tussen thing object?
        }
    }
    return(type);
};

const thingValue = (type, thing) => {
    return type === 'array' ? `[${thing.length}]`
        : type === 'object' ? Object.keys(thing)[0] == '#' ? `{${Object.keys(thing)[0]}${thing['#']}}` : '{}'
            : type === 'set' ? `{${Object.keys(thing)[0]}}`
                : type === 'string' || type === 'number' || type === 'boolean' ? `${thing}`
                    : type === 'nil' ? 'nil'
                        : '';
};

const onlyNums = (str) => str.length == str.replace(/[^0-9.,]/g, '').length;


const buildInput = (input, type) => {
    return type === 'array' ? `[${input}]`
        : type == 'object' ? '{}'
            : type == 'string' ? `'${input}'`
                : type == 'number' || type == 'boolean' ? `${input}`
                    : type == 'set' ? 'set({})'
                        : type == 'nil' ? 'nil'
                            : '';
};

const buildQueryAdd = (id, name, value, type) => {
    return type==='array' ? `#${id}.${name}.push(${value});`
        : type==='object' ? `#${id}.${name} = ${value};`
            : type==='set' ? `#${id}.${name}.add(${value});`
                : '';
};

const buildQueryEdit = (id, name, value, type, index) => {
    return type==='array' ? `#${id}.${name}[${index}] = ${value};`
        : type==='object' ? `#${id}.${name} = ${value};`
            : '';
};

const buildQueryRemove = (parent, parentId, name, index, id) => {
    return index == null ? `#${parentId}.del('${name}');`
        : name == '$' ? `#${parentId}.${parent}.remove(#${parentId}.${parent}.find(|s| (s.id()==${id}) ));`
            : `#${parentId}.${name}.splice(${index}, 1);`;
};


export {
    Add1DArray,
    Buttons,
    buildInput,
    buildQueryAdd,
    buildQueryEdit,
    buildQueryRemove,
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
    thingValue,
    TopBarMenu,
    TreeBranch,
    ThingsTree,
    TreeIcon,
    QueryInput,
    QueryOutput,
    StyledTabs,
    StyledTab
};