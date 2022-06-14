import { amber } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';


import { SimpleModal } from '../../../Utils';
import VisNetwork from './VisNetwork';


const ShowOverview = ({onClose, open, items}) => {
    const theme = useTheme();

    const nodes = items.map(t => ({
        id: t.type_id,
        label: t.name,
        // title: 'blaba',
        // level: 1,
        shape: 'box',
        color: t.wrap_only ? amber[700] : theme.palette.primary.main,
    }));

    const edges = items.reduce((res, t) => {
        const re = new RegExp('\\b' + t.name + '\\b');
        const fct = items.filter(t => re.test(`${t.fields}`));
        const fieldEdges = fct.map(ft => ({
            from: t.type_id,
            to: ft.type_id,
            arrows: 'from',
        }));

        let rct = [];
        Object.values(t.relations).forEach(rel => {
            const relatedType = items.find(rt => rt.name === rel.type);
            rct.push(relatedType);
        });
        const relationEdges = rct.map(rt => ({
            from: t.type_id,
            to: rt.type_id,
            arrows: 'to',
            color: 'green'
        }));

        res.push(...fieldEdges, ...relationEdges);
        return res;
    }, []);

    const options = {
        // groups: {
        //     wrapped: {
        //         shape: 'triangleDown'
        //     },
        //     not_wrapped: {
        //         shape: 'hexagon'
        //     }
        // },
        // interaction: {
        //     selectable: false,
        //     selectConnectedEdges: false
        // },
        // edges: {
        //     smooth: {
        //         enabled: true,
        //         type: 'diagonalCross',
        //         roundness: 0.5
        //     }
        // },
        // nodes: {
        //     shape: 'dot',
        //     size: 16
        // },
        // layout: {
        //     hierarchical: {
        //         enabled: true
        //     }
        // }
    };
    console.log(edges)

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
                <Grid item xs={12}>
                    <VisNetwork edges={edges} nodes={nodes} options={options} />
                </Grid>
            </Grid>
        </SimpleModal>
    );
};


ShowOverview.defaultProps = {
    items: [],
    open: false,
};


ShowOverview.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.object)
};

export default ShowOverview;

