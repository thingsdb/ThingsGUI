import ArrayLayout from './ArrayLayout';
import AutoSelect from './AutoSelect';
import BoolInput from './BoolInput';
import Buttons from './Buttons';
import CardButton from './CardButton';
import CardMultiButton from './CardMultiButton';
import ChipsCard from './ChipsCard';
import Closure from './Closure';
import Copy from './Copy';
import DownloadBlob from './DownloadBlob';
import DownloadTextFile from './DownloadTextFile';
import DragdownCard from './DragdownCard';
import DrawerLayout from './DrawerLayout';
import EditName from './EditName';
import ErrorMsg from './ErrorMsg';
import ErrorToast from './ErrorToast';
import ErrorToastCard from './ErrorToastCard';
import FixedList from './FixedList';
import HarmonicCard from './HarmonicCard';
import HarmonicCardContent from './HarmonicCardContent';
import HarmonicCardHeader from './HarmonicCardHeader';
import HarmonicTree from './HarmonicTree';
import Info from './Info';
import ListHeader from './ListHeader';
import LocalMsg from './LocalMsg';
import LocalErrorMsg from './LocalErrorMsg';
import Menu from './Menu';
import moment from 'moment';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
import RefreshContainer from './RefreshContainer';
import ServerError from './ServerError';
import SimpleModal from './SimpleModal';
import StartStopPolling from './StartStopPolling';
import StickyHeadTable from './StickyHeadTable';
import StringDialog from './StringDialog';
import Switching from './Switching';
import SwitchOpen from './SwitchOpen';
import TableCard from './TableCard';
import TableExtra from './TableExtra';
import TableWithBadges from './TableWithBadges';
import TableWithButtons from './TableWithButtons';
import Tabs from './Tabs';
import ThingsTree from './ThingsTree';
import TimePeriodPicker from './TimePeriodPicker';
import TimePicker from './TimePicker';
import TitlePage from './TitlePage';
import TitlePage2 from './TitlePage2';
import TitlePage3 from './TitlePage3';
import TopBarMenu from './TopBarMenu';
import TreeBranch from './TreeBranch';
import TwoLabelSwitch from './TwoLabelSwitch';
import useStateCallback from './useStateCallback';
import useThingsError from './useThingsError';
import VariablesArray from './VariablesArray';
import WarnPopover from './WarnPopover';

import {SET_KEY, THING_KEY, WRAP_KEY} from '../../Constants/CharacterKeys';
import {ARRAY, BOOL, BYTES, CLOSURE, CODE, DATETIME,ERROR, FLOAT, INT, LIST, NIL, NUMBER, REGEX, ROOM,
    SET, STR, THING, TIMEVAL, WRAP} from '../../Constants/ThingTypes';
import {THINGSDB_SCOPE, NODE_SCOPE, COLLECTION_SCOPE} from '../../Constants/Scopes';
import {THINGDB_CACHE} from '../../Constants/Files';

const checkType = (t) => {
    if (t === null) {
        return(NIL);
    }
    let type = typeof(t);
    if (type === 'string') {
        type = STR;
    } else if (type === 'boolean') {
        type = BOOL;
    } else if (type === 'object') {
        type = Array.isArray(t) ? ARRAY : 'object';
        if (type === 'object') {
            const kindOfObject = Object.keys(t)[0];
            type = kindOfObject === THING_KEY ? THING
                : kindOfObject === SET_KEY ? SET
                    : kindOfObject === WRAP_KEY ? WRAP
                        : 'object' ;
        }
    }

    if (type == STR && t.includes(THINGDB_CACHE)) {
        type = BYTES;
    }
    return(type);
};

const thingValue = (type, thing, customTypes=[]) => {
    return type === ARRAY ? `[${thing.length}]`
        : type === THING ? Object.keys(thing)[0] == THING_KEY ? `{${Object.keys(thing)[0]}${thing[THING_KEY]}}` : '{}'
            : type === 'object' ? `[${Object.keys(thing).length}]`
                : type === STR || type === NUMBER || type === BOOL || type === BYTES ? `${thing}`
                    : type === null || type === NIL ? NIL
                        : type === WRAP ? `<${customTypes.length?customTypes.find(t=> t.type_id==thing[WRAP_KEY][0]).name:thing[WRAP_KEY][0]}, ${THING_KEY}${thing[WRAP_KEY][1][THING_KEY]}>`
                            : type === SET ? `[${thing[SET_KEY].length}]`
                                : '';
};

const isObjectEmpty = (obj) => !(typeof obj === 'object' && Object.entries(obj).length > 0);
const findItem = (index, target) => target.length ? (index+1 > target.length ? {}: target[index]) : {}; //findItem(index-1, target) : target[index]) : {};
const orderByName = (arr, key='name') => arr.sort((a, b) => {
    let nameA,
        nameB;
    if(typeof a[key] === 'string') {
        nameA = a[key].toUpperCase(); // ignore upper and lowercase
        nameB = b[key].toUpperCase(); // ignore upper and lowercase
    } else {
        nameA = a[key];
        nameB = b[key];
    }

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
});

const getScopes = (collections) => [
    [
        {name: 'ThingsDB', value: THINGSDB_SCOPE, collectionId: null},
        {name: 'Node', value: NODE_SCOPE, collectionId: null},
        ...collections.map(c => ({name: c.name, value: `${COLLECTION_SCOPE}:${c.name}`, collectionId: c.collection_id}))
    ],
    [
        THINGSDB_SCOPE, NODE_SCOPE, ...collections.map(c => `${COLLECTION_SCOPE}:${c.name}`)
    ]
];

const getScopes2 = (collections, nodes) => [
    THINGSDB_SCOPE, ...nodes.map((n) => (`${NODE_SCOPE}:${n.node_id}`)), ...collections.map(c => `${COLLECTION_SCOPE}:${c.name}`)
];

const fancyName = (n, ci) => ci !== null ? n + `[${ci}]` : n;

const allDataTypes = (types) => {
    const dataTypes = [
        BOOL,
        BYTES,
        CLOSURE,
        CODE,
        DATETIME,
        ERROR,
        FLOAT,
        INT,
        LIST,
        NIL,
        REGEX,
        ROOM,
        SET,
        STR,
        THING,
        TIMEVAL,
        ...types.map(c=>c.name)
    ].sort();

    return(dataTypes);
};

const duration = (n) => {
    let [time, unit] =  n<60 ? [n, 'second'] :
        n < 3600 ? [n/60, 'minute'] :
            n < 86400 ? [n/3600, 'hour'] :
                [n/86400, 'day'];
    time = Math.round(time);
    return `${time} ${unit}${time>1?'s':''}`;
};

const addDoubleQuotesAroundKeys = (strObject) => strObject.replace(/\{/g, '{"').replace(/:/g, '":').replace(/,(?=[^{]*\})/g, ',"');
const changeSingleToDoubleQuotes = (strObject) => strObject.replace(/'/g, '"');

const revealCustomType = (i) => {
    let arr = 0;
    let opt = 0;
    if(i[0]=='[' || i[0]=='{') {
        arr = 1;
    }
    if(i.includes('?')) {
        opt = arr&&i.slice(-1)=='?'&&i.slice(-3, -2)=='?'? 2: 1;
    }
    return i.slice(arr, i.length-(arr+opt));
};

const swap = (items, index) => {
    const i = items[0];
    items[0] = items[index];
    items[index] = i;
    return items;
};

const scaleToBinBytes = (bytes) => {
    if(bytes === 0) {
        return '0 bytes';
    }
    const metricLabel = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let i = Math.floor(Math.log(Math.ceil(bytes)) / Math.log(1024));
    i = i > 8 ? 8 : i;
    const number = bytes/(1024**i);
    const rounded = Math.round(number);
    return `${rounded === number ? '' : '~'}${rounded} ${metricLabel[i]}`;
};

const nextRunFn = (t) => (t === 'pending' ? t : moment(t).format('YYYY-MM-DD HH:mm'));

const getIdFromPath = (pathname, name) => {
    const splitPath = pathname.split('/');
    const index = splitPath.indexOf(name);
    if (index !== -1) {
        const id = splitPath[index + 1];
        return id || '';
    } else {
        return '';
    }
};

const historyNavigate = (history, pathname, queryParams) => {
    let params = {};

    if (pathname) {
        params.pathname = pathname;
    }

    if (queryParams) {
        let search = '';
        Object.entries(queryParams).forEach(([key, value], index) => {
            let queryParam = '';
            if (index === 0) {
                queryParam = `?${key}=${value}`;
            }
            else {
                queryParam = `&${key}=${value}`;
            }
            search = search.concat(queryParam);
        });
        params.search = search;
    }

    else if (queryParams === undefined) {
        params.search = history.location.search;
    }

    history.push(params);
};

const historySetQueryParam = (history, name, value) => {
    let params = new URLSearchParams(history.location.search);
    params.set(name, value);
    const string = params.toString();
    history.push({ search: string });
};

const historyDeleteQueryParam = (history, name) => {
    let params = new URLSearchParams(history.location.search);
    params.delete(name);
    const string = params.toString();
    history.push({ search: string });
};

const historyGetQueryParam = (history, name) => {
    const params = new URLSearchParams(history.location.search);
    const result = params.get(name);
    return result;
};

const getGreetingTime = (m) => {
    let g = null; //return g

    if(!m || !m.isValid()) {
        return;
    } //if we can't find a valid or filled moment, we return.

    let split_afternoon = 12;  //24hr time to split the afternoon
    let split_evening = 17;  //24hr time to split the evening
    let currentHour = parseFloat(m.format('HH'));

    if(currentHour >= split_afternoon && currentHour <= split_evening) {
        g = 'afternoon';
    } else if(currentHour >= split_evening) {
        g = 'evening';
    } else {
        g = 'morning';
    }

    return g;
};

const desc = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy] || (b[orderBy] !== a[orderBy] && b[orderBy] === null)) {
        return -1;
    }
    if (b[orderBy] > a[orderBy] || (b[orderBy] !== a[orderBy] && a[orderBy] === null)) {
        return 1;
    }
    return 0;
};

const stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) => {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
};

export {
    addDoubleQuotesAroundKeys,
    allDataTypes,
    ArrayLayout,
    AutoSelect,
    BoolInput,
    Buttons,
    CardButton,
    CardMultiButton,
    changeSingleToDoubleQuotes,
    checkType,
    ChipsCard,
    Closure,
    Copy,
    DownloadBlob,
    DownloadTextFile,
    DragdownCard,
    DrawerLayout,
    duration,
    EditName,
    ErrorMsg,
    ErrorToast,
    ErrorToastCard,
    fancyName,
    findItem,
    FixedList,
    getGreetingTime,
    getIdFromPath,
    getScopes,
    getScopes2,
    getSorting,
    HarmonicCard,
    HarmonicCardContent,
    HarmonicCardHeader,
    HarmonicTree,
    historyDeleteQueryParam,
    historyGetQueryParam,
    historyNavigate,
    historySetQueryParam,
    Info,
    isObjectEmpty,
    ListHeader,
    LocalErrorMsg,
    LocalMsg,
    Menu,
    nextRunFn,
    orderByName,
    QueryInput,
    QueryOutput,
    RefreshContainer,
    revealCustomType,
    scaleToBinBytes,
    ServerError,
    SimpleModal,
    stableSort,
    StartStopPolling,
    StickyHeadTable,
    StringDialog,
    swap,
    Switching,
    SwitchOpen,
    TableCard,
    TableExtra,
    TableWithBadges,
    TableWithButtons,
    Tabs,
    ThingsTree,
    thingValue,
    TimePeriodPicker,
    TimePicker,
    TitlePage,
    TitlePage2,
    TitlePage3,
    TopBarMenu,
    TreeBranch,
    TwoLabelSwitch,
    useStateCallback,
    useThingsError,
    VariablesArray,
    WarnPopover,
};