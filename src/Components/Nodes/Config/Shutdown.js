import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';

import { ErrorMsg, SimpleModal } from '../../Util';
import {NodesActions} from '../../../Stores';


const tag = '13';

const CountersReset = ({node}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        NodesActions.shutdown(
            node.node_id,
            tag,
            () => setShow(false));
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Shutdown'}
                </Button>
            }
            title="Shutdown node?"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            <ErrorMsg tag={tag} />
        </SimpleModal>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default CountersReset;