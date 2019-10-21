import Add1DArray from './Add1DArray';
import AddBlob from './AddBlob';
import AddBool from './AddBool';
import Buttons from './Buttons';
import CardButton from './CardButton';
import Chips from './Chips';
import DrawerLayout from './DrawerLayout';
import ErrorMsg from './ErrorMsg';
import ErrorToast from './ErrorToast';
import HarmonicCard from './HarmonicCard';
import Info from './Info';
import Menu from './Menu';
import ServerError from './ServerError';
import SimpleModal from './SimpleModal';
import TableWithButtons from './TableWithButtons';
import ThingsTree from './ThingsTree';
import TimePicker from './TimePicker';
import TimePeriodPicker from './TimePeriodPicker';
import TitlePage from './TitlePage';
import TitlePage2 from './TitlePage2';
import TopBarMenu from './TopBarMenu';
import TreeBranch from './TreeBranch';
import TreeIcon from './TreeIcon';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
import WatchThings from './WatchThings';

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
                : kindOfObject === '$' ? 'set'
                    : kindOfObject === '>' ? 'closure' : 'object' ; // todo maak onderscheid tussen thing object?
        }
    }
    return(type);
};

const thingValue = (type, thing) => {
    return type === 'array' ? `[${thing.length}]`
        : type === 'object' ? Object.keys(thing)[0] == '#' ? `{${Object.keys(thing)[0]}${thing['#']}}` : '{}'
            : type === 'set' ? `{${Object.keys(thing)[0]}}`
                : type === 'closure' ? `{${Object.keys(thing)[0]}}`
                    : type === 'string' || type === 'number' || type === 'boolean' ? `${thing}`
                        : type === 'nil' ? 'nil'
                            : '';
};

const onlyNums = (str) => str.length == str.replace(/[^0-9.,]/g, '').length;
// const closureSyntax = (str) => str.length == str.replace(/[^0-9.,]/g, '').length;

const buildInput = (input, type) => {
    return type === 'array' ? `[${input}]`
        : type == 'object' ? '{}'
            : type == 'string' ? `'${input}'`
                : type == 'number' || type == 'boolean' ? `${input}`
                    : type == 'set' ? 'set({})'
                        : type == 'nil' ? 'nil'
                            : type == 'blob' ? 'blob'
                                : type == 'closure' ? input
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

const isObjectEmpty = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object;
const findItem = (index, target) => target.length ? (index+1 > target.length ? findItem(index-1, target) : target[index]) : {};

const getScopes = (collections) => [
    [
        {name: 'ThingsDB', value: '@thingsdb', collectionId: null},
        {name: 'Node', value: '@node', collectionId: null},
        ...collections.map((c) => ({name: c.name, value: `@collection:${c.name}`, collectionId: c.collection_id}))
    ],
    [
        '@thingsdb', '@node', ...collections.map((c) => (`@collection:${c.name}`))
    ]
];


export {
    Add1DArray,
    AddBlob,
    AddBool,
    Buttons,
    buildInput,
    buildQueryAdd,
    buildQueryEdit,
    buildQueryRemove,
    CardButton,
    Chips,
    checkType,
    DrawerLayout,
    ErrorMsg,
    ErrorToast,
    findItem,
    HarmonicCard,
    Info,
    isObjectEmpty,
    Menu,
    onlyNums,
    getScopes,
    ServerError,
    SimpleModal,
    TableWithButtons,
    thingValue,
    TopBarMenu,
    TimePicker,
    TimePeriodPicker,
    TitlePage,
    TitlePage2,
    TreeBranch,
    ThingsTree,
    TreeIcon,
    QueryInput,
    QueryOutput,
    WatchThings,
};