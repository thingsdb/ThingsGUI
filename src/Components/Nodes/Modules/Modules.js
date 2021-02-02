/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import { Buttons } from '../Utils';
import {NodesActions, NodesStore} from '../../../Stores';
import {TableWithButtons} from '../../Util';
import Add from './Add';
import ModuleInfo from './ModuleInfo';
import Remove from './Remove';
import StatusIcon from './StatusIcon';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['modules']
}]);

const useStyles = makeStyles(theme => ({
    overflow: {
        marginTop: theme.spacing(2),
        overflowY: 'auto',
        overflowX: 'auto',
        maxHeight: '400px',
    },
}));

const header = [
    {ky: 'created_at', label: 'Created at', fn: (t) => moment(t*1000).format('YYYY-MM-DD HH:mm:ss')},
    {ky: 'name', label: 'Name'},
    {ky: 'scope', label: 'Scope', fn: (s) => s ? s : 'All scopes'},
    {ky: 'status', label: 'Status', fn: (s) => <StatusIcon status={s} />},
];

const link = 'https://docs.thingsdb.net/v0/thingsdb-api/module_info/';

const Modules = ({nodeId, offline, modules}) => {
    const classes = useStyles();

    const handleRefresh = () => {
        NodesActions.getModules(nodeId); // update of the selected node; to get the latest info
    };

    // const handleRestart = (module) => {
    //     NodesActions.restartModule(nodeId, module.name); // update of the selected node; to get the latest info
    // };


    const handleButtons = (module) => (
        <React.Fragment>
            <Remove nodeId={nodeId} item={module} />
            <ModuleInfo nodeId={nodeId} item={module} />
        </React.Fragment>
    );

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid item xs={12} className={classes.overflow}>
                {modules.length ? (
                    <TableWithButtons header={header} rows={modules} buttons={handleButtons} />
                ) : (
                    <Typography variant="subtitle2">
                        {'no module information'}
                    </Typography>
                )}
            </Grid>
            {offline ? null : (
                <Buttons
                    extraButtons={[<Add key="add_button" nodeId={nodeId} />]}
                    link={link}
                    onRefresh={handleRefresh}
                />
            )}
        </Grid>
    );
};

Modules.propTypes = {
    nodeId: PropTypes.number.isRequired,
    offline: PropTypes.bool.isRequired,

    /* nodes properties */
    modules: NodesStore.types.modules.isRequired,
};

export default withStores(Modules);