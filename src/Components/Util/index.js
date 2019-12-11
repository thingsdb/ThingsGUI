import Add1DArray from './Add1DArray';
import AddBlob from './AddBlob';
import AddBool from './AddBool';
import AddClosure from './AddClosure';
import AddError from './AddError';
import AddRegex from './AddRegex';
import AddThing from './AddThing';
import ArrayLayout from './ArrayLayout';
import AutoSelect from './AutoSelect';
import Buttons from './Buttons';
import CardButton from './CardButton';
import ChipsCard from './ChipsCard';
import DownloadBlob from './DownloadBlob';
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
import VariablesArray from './VariablesArray';
import WarnPopover from './WarnPopover';

const checkType = (t) => {
    if (t === null || t === 'nil') {
        return('nil');
    }
    let type = typeof(t);
    if (type === 'string') {
        type = 'str';
    } else if (type === 'boolean') {
        type = 'bool';
    } else if (type === 'object') {
        type = Array.isArray(t) ? 'array' : 'object';
        if (type === 'object') {
            const kindOfObject = Object.keys(t)[0];
            type = kindOfObject === '#' ? 'thing'
                : kindOfObject === '/' ? 'closure'
                    : kindOfObject === '*' ? 'regex'
                        : kindOfObject === '!' ? 'error'
                            : 'object' ; // todo maak onderscheid tussen thing object?
        }
    }

    if (type == 'str' && t.includes('/download/tmp/thingsdb-cache')) {
        type = 'bytes';
    }
    return(type);
};

const thingValue = (type, thing) => {
    return type === 'array' ? `[${thing.length}]`
        : type === 'thing' ? Object.keys(thing)[0] == '#' ? `{${Object.keys(thing)[0]}${thing['#']}}` : '{}'
            : type === 'str' || type === 'number' || type === 'bool' || type === 'bytes' ? `${thing}`
                : type === 'closure' || type === 'regex' || type === 'error' ? `{${Object.keys(thing)[0]}}`
                    : type === null || type === 'nil' ? 'nil'
                        : '';
};

const onlyNums = (str) => str.length == str.replace(/[^0-9.,]/g, '').length;

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

const getScopes2 = (collections, nodes) => [
    [
        {name: 'ThingsDB', value: '@thingsdb', collectionId: null},
        ...nodes.map((n) => ({name: `Node:${n.node_id}`, value: `@node:${n.node_id}`, collectionId: null})),
        ...collections.map((c) => ({name: c.name, value: `@collection:${c.name}`, collectionId: c.collection_id}))
    ],
    [
        '@thingsdb', ...nodes.map((n) => (`@node:${n.node_id}`)), ...collections.map((c) => (`@collection:${c.name}`))
    ]
];

const fancyName = (n, ci) => ci !== null ? n + `[${ci}]` : n;


export {
    Add1DArray,
    AddBlob,
    AddBool,
    AddClosure,
    AddError,
    AddRegex,
    AddThing,
    ArrayLayout,
    AutoSelect,
    Buttons,
    CardButton,
    ChipsCard,
    checkType,
    DownloadBlob,
    DrawerLayout,
    ErrorMsg,
    ErrorToast,
    fancyName,
    findItem,
    HarmonicCard,
    Info,
    isObjectEmpty,
    Menu,
    onlyNums,
    getScopes,
    getScopes2,
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
    VariablesArray,
    WarnPopover,
};