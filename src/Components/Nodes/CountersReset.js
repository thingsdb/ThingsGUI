import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {NodesActions} from '../../Stores/NodesStore';
import ServerError from '../Util/ServerError';


const CountersReset = ({node}) => {
    const [serverError, setServerError] = useState('');

    const resetCounters = React.useCallback(
        () => {
            const onError = (err) => setServerError(err);
            NodesActions.resetCounters(node, onError)
        },
        [node],
    );

    const handleClickOk = () => {
        resetCounters();
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Reset counters'}
            </Button>
        </React.Fragment>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default CountersReset;