/* eslint-disable react/no-multi-comp */
import makeStyles from '@mui/styles/makeStyles';
import {withVlow} from 'vlow';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {Buttons} from '../Utils';
import {DATE_TIME_SEC_STR} from '../../../Constants/DateStrings';
import {NodesActions, NodesStore} from '../../../Stores';
import {TableWithButtons} from '../../Util';
import {THINGS_DOC_MODULE_INFO} from '../../../Constants/Links';
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
    {ky: 'created_at', label: 'Created at', fn: (t) => moment(t*1000).format(DATE_TIME_SEC_STR)},
    {ky: 'name', label: 'Name'},
    {ky: 'scope', label: 'Scope', fn: (s) => s ? s : 'All scopes'},
    {ky: 'status', label: 'Status', fn: (s) => <StatusIcon status={s} />},
];

const link = THINGS_DOC_MODULE_INFO;

const Modules = ({nodeId, offline, modules}) => {
    const classes = useStyles();

    const handleRefresh = () => {
        NodesActions.getModules(nodeId); // update of the selected node; to get the latest info
    };

    const handleButtons = (_module) => (
        <React.Fragment>
            <Remove nodeId={nodeId} item={_module} />
            <ModuleInfo nodeId={nodeId} item={_module} />
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