import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';

import { ErrorMsg, SimpleModal } from '../Util';
import NodesActions from '../../Actions/NodesActions';



const CountersReset = ({node}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };
    const handleClickOk = () => {
        NodesActions.shutdown(node);
        setShow(false);
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
        />
        //     <ErrorMsg error={serverError} onClose={handleCloseError} />
        // </SimpleModal>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default CountersReset;