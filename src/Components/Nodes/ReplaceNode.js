import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {NodesActions} from '../../Stores/NodesStore';
import ServerError from '../Util/ServerError';


const ReplaceNode = ({node}) => {
    const [serverError, setServerError] = React.useState('');

    const handleClickOk = () => {
        NodesActions.replaceNode({
            name,
            
            },
            (err) => setServerError(err)
        );
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Replace Node'}
            </Button>
        </React.Fragment>
    );
};

ReplaceNode.propTypes = {
    node: PropTypes.object.isRequired,
};

export default ReplaceNode;