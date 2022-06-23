import { amber } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { withVlow } from 'vlow';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { COLLECTION_SCOPE } from '../../../../Constants/Scopes';
import { EnumActions, EnumStore, TypeActions, TypeStore } from '../../../../Stores';
import { SearchInput, SimpleModal } from '../../../Utils';
import { TypeEnumNetworkTag } from '../../../../Constants/Tags';
import VisNetwork from './VisNetwork';

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

const TypeEnumNetwork = ({collection, customTypes, enums}) => {
    const theme = useTheme();
    const [show, setShow] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const scope = `${COLLECTION_SCOPE}:${collection.name}`;
    const _customTypes = customTypes[scope] || [];
    const _enums = enums[scope] || [];

    React.useEffect(() => {
        EnumActions.getEnums(scope, tag);
        TypeActions.getTypes(scope, tag);
    }, [scope]);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
        setSearch('');
    };

    const typeNodes = _customTypes.map(t => ({
        id: 't' + t.type_id,
        label: t.name,
        title: t.wrap_only ? 'Wrapped type' : 'Type',
        group: t.wrap_only ? 'wrappedType' : 'type',
    }));

    const enumNodes = _enums.map(t => ({
        id: 'e' + t.enum_id,
        label: t.name,
        title: 'Enum',
        group: 'enum',
    }));

    const nodes = [...typeNodes, ...enumNodes];

    const edges = [..._customTypes, ..._enums].reduce((res, t) => {
        const re = new RegExp('\\b' + t.name + '\\b');
        const fct = _customTypes.filter(t => re.test(`${t.fields}`));
        const fieldEdges = fct.map(ft => ({
            arrows: 'from',
            color: theme.palette.text.primary,
            from: t.type_id ? 't' + t.type_id : 'e' + t.enum_id,
            title: 'PROPERTY\n' + ft.fields.map(([k, v]) => `${k}: ${v}`).join(',\n'),
            to: ft.type_id ? 't' + ft.type_id : 'e' + ft.enum_id,
        }));

        let rct = [];
        Object.values(t.relations || {}).forEach(rel => {
            const relatedType = _customTypes.find(rt => rt.name === rel.type);
            rct.push(relatedType);
        });
        const relationEdges = rct.map(rt => ({
            arrows: 'to',
            color: theme.palette.secondary.main,
            from: 't' + t.type_id,
            title: 'RELATION\n' + Object.entries(rt.relations).map(([k, v]) => `${k}: ${`${v.property} on ${v.type} as ${v.definition}`}`).join(',\n'),
            to: 't' + rt.type_id,
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
                color: theme.palette.primary.green,
            },
        },
    };

    const nodeId = findNodeId(_customTypes, search, 'type_id', 't') || findNodeId(_enums, search, 'enum_id', 'e') || '';

    return (
        <SimpleModal
            button={(_customTypes.length > 0 || _enums.length > 0) &&
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Type and Enum network'}
                </Button>
            }
            open={show}
            onClose={handleClickClose}
            maxWidth="lg"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="h4" color='primary' component='span'>
                            {'Type and Enum connections'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1} item xs={12}>
                    <Grid item>
                        <SearchInput
                            onChange={({target}) => setSearch(target.value)}
                            value={search}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <VisNetwork edges={edges} nodes={nodes} options={options} nodeId={nodeId} />
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

TypeEnumNetwork.propTypes = {
    collection: PropTypes.object.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(TypeEnumNetwork);

