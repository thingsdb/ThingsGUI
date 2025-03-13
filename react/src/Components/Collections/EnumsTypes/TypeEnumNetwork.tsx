import { amber, red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { withVlow } from 'vlow';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';

import { COLLECTION_SCOPE } from '../../../Constants/Scopes';
import { EnumActions, EnumStore, TypeActions, TypeStore } from '../../../Stores';
import { HarmonicCard, SearchInput } from '../../Utils';
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

const TypeEnumNetwork = ({collection, customTypes, enums}: IEnumStore & ITypeStore & Props) => {
    const theme = useTheme();
    const [search, setSearch] = React.useState('');
    const scope = `${COLLECTION_SCOPE}:${collection.name}`;
    const _customTypes = customTypes[scope] || [];
    const _enums = enums[scope] || [];

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

    const edges = [..._customTypes, ..._enums].reduce((res, t) => {
        const re = new RegExp('\\b' + t.name + '\\b');
        const fct = _customTypes.filter(t => re.test(`${t.fields}`));
        const fieldEdges = fct.map(ft => ({
            arrows: 'from',
            color: theme.palette.text.primary,
            from: t.type_id != undefined ? createTypeId(t.type_id) : createEnumId(t.enum_id),
            title: ft.fields.filter(([, v]) => v.includes(t.name)).map(([k, v]) => `property ${k} on ${ft.name} as ${v}`).join(',\n'),
            to: ft.type_id != undefined ? createTypeId(ft.type_id) : createEnumId(ft.enum_id),
        }));

        let rct = [];
        Object.values(t.relations || {}).forEach(rel => {
            const relatedType = _customTypes.find(rt => rt.name === rel.type);
            rct.push(relatedType);
        });
        const relationEdges = rct.map(rt => ({
            arrows: 'to',
            color: red[700],
            from: createTypeId(t.type_id),
            // @ts-ignore TODOT type IType
            title: Object.entries(rt.relations).map(([k, v]) => `relation ${k}<->${`${v.property} on ${v.type} as ${v.definition}`}`).join(',\n'),
            to: createTypeId(rt.type_id),
            smooth: {
                type: 'curvedCW',
                roundness: 0.4
            },
        }));

        res.push(...fieldEdges, ...relationEdges);
        return res;
    }, []);

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
                // @ts-ignore PaletteOptions
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
            />
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

interface Props {
    collection: ICollection;
};