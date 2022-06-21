import { amber } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { SimpleModal } from '../../../Utils';
import VisNetwork from './VisNetwork';


const ShowOverview = ({customTypes, enums, onClose, open}) => {
    const theme = useTheme();
    const [search, setSearch] = React.useState('');

    const typeNodes = customTypes.map(t => ({
        id: 't' + t.type_id,
        label: t.name,
        title: t.wrap_only ? 'Wrapped type' : 'Type',
        group: t.wrap_only ? 'wrappedType' : 'type',
        // title: 'blaba',
        // level: 1,
    }));

    const enumNodes = enums.map(t => ({
        id: 'e' + t.enum_id,
        label: t.name,
        title: 'Enum',
        group: 'enum',
        // title: 'blaba',
        // level: 1,
    }));

    const nodes = [...typeNodes, ...enumNodes];

    const edges = [...customTypes, ...enums].reduce((res, t) => {
        const re = new RegExp('\\b' + t.name + '\\b');
        const fct = customTypes.filter(t => re.test(`${t.fields}`));
        const fieldEdges = fct.map(ft => ({
            from: t.type_id ? 't' + t.type_id : 'e' + t.enum_id,
            to: ft.type_id ? 't' + ft.type_id : 'e' + ft.enum_id,
            arrows: 'from',
            color: theme.palette.text.primary
        }));

        let rct = [];
        Object.values(t.relations || {}).forEach(rel => {
            const relatedType = customTypes.find(rt => rt.name === rel.type);
            rct.push(relatedType);
        });
        const relationEdges = rct.map(rt => ({
            from: 't' + t.type_id,
            to: 't' + rt.type_id,
            arrows: 'to',
            label: 'relation',
            color: theme.palette.primary.warning
        }));

        res.push(...fieldEdges, ...relationEdges);
        return res;
    }, []);

    const options = {
        edges: {
            font: {
                size: 12,
            },
        },
        nodes: {
            shape: 'box',
            font: {
                color: '#000',
            },
        },
        physics: {
            enabled: false,
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

    const nodeObj = customTypes.find(ct => ct.name.toLowerCase() === search.toLowerCase()) || enums.find(ct => ct.name.toLowerCase() === search.toLowerCase());
    const nodeId = nodeObj?.enum_id !== undefined ? 'e' + nodeObj.enum_id : nodeObj?.type_id !== undefined ? 't' + nodeObj.type_id : '';


    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            maxWidth="lg"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="h4" color='primary' component='span'>
                            {'Overview of all types'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <TextField
                            label="Search"
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


ShowOverview.defaultProps = {
    customTypes: [],
    enums: [],
    open: false,
};


ShowOverview.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object),
    enums: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
};

export default ShowOverview;

