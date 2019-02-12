// import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Node from './Node';
import Tabel from '../Util/Table2';
import {ApplicationStore} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['nodes'],
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Nodes extends React.Component {
    
    render() {
        const {nodes} = this.props;
        
        const rows = nodes;
        const header = [{
            ky: 'address',
            label: 'Address',
        }, {
            ky: 'port',
            label: 'Port',
        }, {
            ky: 'status',
            label: 'Status',
        }];
        const rowExtend = (row) => <Node node={row} />;

        return (
            <React.Fragment>
                <Tabel header={header} rows={rows} rowExtend={rowExtend} />
            </React.Fragment>
        );
    }
}

Nodes.propTypes = {
    // classes: PropTypes.object.isRequired,
    nodes: ApplicationStore.types.nodes.isRequired
};

export default withStores(withStyles(styles)(Nodes));