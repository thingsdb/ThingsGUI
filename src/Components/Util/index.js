import ArrayLayout from './ArrayLayout';
import AutoSelect from './AutoSelect';
import Buttons from './Buttons';
import CardButton from './CardButton';
import ChipsCard from './ChipsCard';
import Closure from './Closure';
import DownloadBlob from './DownloadBlob';
import DrawerLayout from './DrawerLayout';
import ErrorMsg from './ErrorMsg';
import ErrorToast from './ErrorToast';
import HarmonicCard from './HarmonicCard';
import HarmonicTree from './HarmonicTree';
import Info from './Info';
import ListHeader from './ListHeader';
import LocalErrorMsg from './LocalErrorMsg';
import Menu from './Menu';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
import ServerError from './ServerError';
import SimpleModal from './SimpleModal';
import TableWithButtons from './TableWithButtons';
import ThingsTree from './ThingsTree';
import TimePeriodPicker from './TimePeriodPicker';
import TimePicker from './TimePicker';
import TitlePage from './TitlePage';
import TitlePage2 from './TitlePage2';
import TopBarMenu from './TopBarMenu';
import TreeBranch from './TreeBranch';
import TreeIcon from './TreeIcon';
import VariablesArray from './VariablesArray';
import WarnPopover from './WarnPopover';

const checkType = (t) => {
    if (t === null) {
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
                            : kindOfObject === '$' ? 'set' //set
                                : kindOfObject === '&' ? 'wrap'
                                    : 'object' ;
        }
    }

    if (type == 'str' && t.includes('/download/tmp/thingsdb-cache')) {
        type = 'bytes';
    }
    return(type);
};

const thingValue = (type, thing, customTypes=[]) => {
    return type === 'array' ? `[${thing.length}]`
        : type === 'thing' ? Object.keys(thing)[0] == '#' ? `{${Object.keys(thing)[0]}${thing['#']}}` : '{}'
            : type === 'str' || type === 'number' || type === 'bool' || type === 'bytes' ? `${thing}`
                : type === 'closure' || type === 'regex' || type === 'error' ? `{${Object.keys(thing)[0]}}`
                    : type === null || type === 'nil' ? 'nil'
                        : type === 'wrap' ? `<${customTypes.length?customTypes.find(t=> t.type_id==thing['&'][0]).name:thing['&'][0]}, #${thing['&'][1]['#']}>`
                            : type === 'set' ? `[${thing['$'].length}]`
                                : '';
};

const isObjectEmpty = (obj) => obj.constructor === Object && Object.entries(obj).length === 0;
const findItem = (index, target) => target.length ? (index+1 > target.length ? {}: target[index]) : {}; //findItem(index-1, target) : target[index]) : {};

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

const duration = (n) => {
    let [time, unit] =  n<60 ? [n, 'second'] :
        n < 3600 ? [n/60, 'minute'] :
            n < 86400 ? [n/3600, 'hour'] :
                [n/86400, 'day'];
    time = Math.round(time);
    return `${time} ${unit}${time>1?'s':''}`;
};

export {
    ArrayLayout,
    AutoSelect,
    Buttons,
    CardButton,
    checkType,
    ChipsCard,
    Closure,
    DownloadBlob,
    DrawerLayout,
    duration,
    ErrorMsg,
    ErrorToast,
    fancyName,
    findItem,
    getScopes,
    getScopes2,
    HarmonicCard,
    HarmonicTree,
    Info,
    isObjectEmpty,
    ListHeader,
    LocalErrorMsg,
    Menu,
    QueryInput,
    QueryOutput,
    ServerError,
    SimpleModal,
    TableWithButtons,
    ThingsTree,
    thingValue,
    TimePeriodPicker,
    TimePicker,
    TitlePage,
    TitlePage2,
    TopBarMenu,
    TreeBranch,
    TreeIcon,
    VariablesArray,
    WarnPopover,
};