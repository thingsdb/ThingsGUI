import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {NodesActions} from '../../Stores/NodesStore';
import ServerError from '../Util/ServerError';


const CountersReset = ({node}) => {
    const [serverError, setServerError] = React.useState('');

    const handleClickOk = () => {
        NodesActions.shutdown(node, (err) => setServerError(err));
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Shutdown'}
            </Button>
        </React.Fragment>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default CountersReset;