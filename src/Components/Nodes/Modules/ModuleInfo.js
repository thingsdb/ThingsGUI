import {withVlow} from 'vlow';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import PropTypes from 'prop-types';
import React from 'react';

import {Info, SimpleModal} from '../../Util';
import {NodesActions, NodesStore} from '../../../Stores';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['_module']
}]);

const header = [
    {ky: 'created_at', label: 'Created at', fn: (t) => moment(t*1000).format('YYYY-MM-DD HH:mm:ss')},
    {ky: 'name', label: 'Name'},
    {ky: 'file', label: 'File'},
    {ky: 'scope', label: 'Scope', fn: (s) => s ? s : 'All scopes'},
    {ky: 'status', label: 'Status'},
    {ky: 'conf', label: 'Configuration'},
    {ky: 'restarts', label: 'Number of restarts'},
    {ky: 'tasks', label: 'Number of running tasks'},
];

const ModuleInfo = ({item, nodeId, _module}) => {
    const [show, setShow] = React.useState(false);

    // React.useEffect(() => {
    //     NodesActions.getModule(nodeId, item.name);
    // }, []);

    const handleClickOpen = () => {
        NodesActions.getModule(nodeId, item.name);
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    return (
        <SimpleModal
            button={
                <IconButton onClick={handleClickOpen}>
                    <MoreIcon color="primary" />
                </IconButton>
            }
            open={show}
            onClose={handleClickClose}
            maxWidth="md"
            title="Module info"
        >
            <Info
                header={
                    [{ky: 'title1', title: '', labels: header}]
                }
                content={_module}
            />
        </SimpleModal>
    );
};

ModuleInfo.defaultProps = {
    item: {},
};

ModuleInfo.propTypes = {
    item: PropTypes.object,
    nodeId: PropTypes.number.isRequired,

    /* nodes properties */
    _module: NodesStore.types._module.isRequired,
};

export default withStores(ModuleInfo);