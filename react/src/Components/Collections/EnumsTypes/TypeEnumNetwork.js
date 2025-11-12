import { amber, red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { withVlow } from 'vlow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PropTypes from 'prop-types';
import React from 'react';
import Slide from '@mui/material/Slide';

import { COLLECTION_SCOPE } from '../../../Constants/Scopes';
import { EnumActions, EnumStore, TypeActions, TypeStore } from '../../../Stores';
import { HarmonicCard, SearchInput } from '../../Utils';
import { TopBar } from '../../Navigation';
import { TypeEnumNetworkTag } from '../../../Constants/Tags';
import VisNetwork from './Utils/VisNetwork';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);


const changeChosenEdgeWidth = (values) => {
    values.width = 3;
};

const findNodeId = (arr, search, key, prefix) => {
    let obj = arr.find((el) => el.name.toLowerCase() === search.toLowerCase());
    return obj ? prefix + obj[key] : '';
};

const tag = TypeEnumNetworkTag;
const createEnumId = (id) => 'e' + id;
const createTypeId = (id) => 't' + id;

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit />;
});

const TypeEnumNetwork = ({collection, customTypes, enums}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const scope = `${COLLECTION_SCOPE}:${collection.name}`;
    const _customTypes = customTypes[scope] || [];
    const _enums = enums[scope] || [];

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleRefresh = React.useCallback(() => {
        EnumActions.getEnums(scope, tag);
        TypeActions.getTypes(scope, tag);
    }, [scope]);

    React.useEffect(() => {
        handleRefresh();
    }, [handleRefresh]);

    const typeNodes = _customTypes.map(t => ({
        id: createTypeId(t.type_id),
        label: t.name,
        title: t.wrap_only ? `${t.name} (Wrap-only Type)\n${t.fields.map(([k, v]) => `${k}: ${v}`).join(',\n')}` : `${t.name} (Type)\n${t.fields.map(([k, v]) => `${k}: ${v}`).join(',\n')}`,
        group: t.wrap_only ? 'wrappedType' : 'type',
    }));

    const enumNodes = _enums.map(e => ({
        id: createEnumId(e.enum_id),
        label: e.name,
        title: `${e.name} (Enum)\n${e.members.map(([k, v]) => `${k}: ${v}`).join(',\n')}`,
        group: 'enum',
    }));

    const nodes = [...typeNodes, ...enumNodes];

    const relationEdges = [];
    const tlk = _customTypes.reduce((res, t) => ({...res, [t.name]: t}), {});
    _customTypes.forEach(t => {
        const from = createTypeId(t.type_id);
        const grouped = Object.entries(t.relations || {}).reduce((res, [k, v]) => {
            const typeId = createTypeId(tlk[v.type].type_id);
            res[typeId] = res[typeId] || [];
            res[typeId].push([k, v]);
            return res;
        }, {});
        Object.entries(grouped).forEach(([to, relations]) => {
            if (!relationEdges.some(e => e.from === from && e.to === to || e.from === to && e.to === from)) {
                relationEdges.push({
                    arrows: 'from;to',
                    color: red[700],
                    from,
                    title: relations.map(([k, v]) => `${t.name}.${k} ${tlk[v.type].relations[v.property].definition.startsWith('{') ? '*' : '<'}--${v.definition.startsWith('{') ? '*' : '>'} ${`${v.type}.${v.property}`}`).join(',\n'),
                    to,
                    smooth: {
                        type: 'curvedCW',
                        roundness: 0.4
                    },
                });
            }
        });
    });

    const moreEdges = [..._customTypes, ..._enums].reduce((res, t) => {
        const re = new RegExp('\\b' + t.name + '\\b');
        const fct = _customTypes.filter(t => re.test(`${t.fields}`));
        const fieldEdges = fct.map(ft => ({
            arrows: 'from',
            color: theme.palette.text.primary,
            from: t.type_id != undefined ? createTypeId(t.type_id) : createEnumId(t.enum_id),
            title: ft.fields.filter(([, v]) => typeof v === 'string' && v.includes(t.name)).map(([k, v]) => `property ${k} on ${ft.name} as ${v}`).join(',\n'),
            to: ft.type_id != undefined ? createTypeId(ft.type_id) : createEnumId(ft.enum_id),
        }));

        res.push(...fieldEdges);
        return res;
    }, []);

    const edges = [...relationEdges, ...moreEdges.filter(d => !relationEdges.some(e => e.from === d.from && e.to === d.to || e.from === d.to && e.to === d.from))]

    const options = {
        edges: {
            font: {
                size: 12,
                strokeWidth: 0,
                face: 'arial',
                color: '#fff',
            },
            smooth: {
                type: 'curvedCW',
                roundness: 0.2
            },
            chosen: { label: false, edge: changeChosenEdgeWidth },
        },
        nodes: {
            shape: 'box',
            font: {
                color: '#000',
            },
        },
        physics: {
            enabled: false,
            repulsion: {
                nodeDistance: 200
            },
            solver: 'repulsion'
        },
        interaction: {
            hover: true,
        },
        groups: {
            type: {
                shape: 'box',
                color: theme.palette.primary.main,
            },
            wrappedType: {
                shape: 'box',
                color: amber[300],
            },
            enum: {
                shape: 'box',
                color: theme.palette.primary.green,
            },
        },
    };

    const nodeId = findNodeId(_customTypes, search, 'type_id', 't') || findNodeId(_enums, search, 'enum_id', 'e') || '';

    return ((_customTypes.length > 0 || _enums.length > 0) && (
        <Grid size={12} sx={{paddingBottom: '8px'}}>
            <HarmonicCard
                title="TYPE AND ENUM NETWORK"
                content={
                    <Grid container spacing={1}>
                        <Grid container spacing={1} size={12}>
                            <Grid>
                                <SearchInput
                                    onChange={({target}) => setSearch(target.value)}
                                    value={search}
                                />
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <VisNetwork edges={edges} nodes={nodes} options={options} nodeId={nodeId} />
                        </Grid>
                    </Grid>
                }
                unmountOnExit
                onRefresh={handleRefresh}
                actionButtons={
                    <Button color="primary" onClick={handleOpen} aria-label="close">
                        <OpenInNewIcon color="primary" />
                    </Button>
                }
            />
            <Dialog fullScreen open={open} onClose={handleOpen} slots={{transition: Transition}} unmountOnExit>
                <div>
                    <TopBar
                        pageIcon={
                            <IconButton edge="start" onClick={handleOpen} aria-label="close">
                                <ExpandMoreIcon />
                            </IconButton>
                        }
                    />
                </div>
                <DialogContent>
                    <VisNetwork edges={edges} nodes={nodes} options={options} nodeId={nodeId} />
                </DialogContent>
            </Dialog>
        </Grid>
    ));
};

TypeEnumNetwork.propTypes = {
    collection: PropTypes.object.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(TypeEnumNetwork);
