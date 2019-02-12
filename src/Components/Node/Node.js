import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import Counters from './Counters';
import CountersReset from './CountersReset';
import Shutdown from './Shutdown';
import {ApplicationStore} from '../../Stores/ApplicationStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match'],
});

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class User extends React.Component {
    
    render() {
        const {node} = this.props;
        
        return (
            <React.Fragment>
                {/* <Typography>
                    {node.name}
                </Typography> */}

                <Typography variant="h6" >
                    {'Counters'}
                </Typography>
                <Counters node={node} />
                <CountersReset node={node} />
                <Shutdown node={node} />
                
            </React.Fragment>
        );
    }
}

User.propTypes = {
    // classes: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    // match: ApplicationStore.types.match.isRequired,
};

export default withStores(withStyles(styles)(User));