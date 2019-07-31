import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {NodesActions} from '../../Stores/NodesStore';
import ServerError from '../Util/ServerError';


const PopNode = ({node}) => {
    const [serverError, setServerError] = React.useState('');

    const handleClickOk = () => {
        NodesActions.popNode((err) => setServerError(err));
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Pop Node'}
            </Button>
        </React.Fragment>
    );
};

PopNode.propTypes = {
    node: PropTypes.object.isRequired,
};

export default PopNode;