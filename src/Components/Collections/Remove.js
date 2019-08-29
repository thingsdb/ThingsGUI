import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';

import { ErrorMsg, SimpleModal } from '../Util';
import ThingsdbActions from '../../Actions/ThingsdbActions';

const thingsdbActions = new ThingsdbActions();


const Remove = ({collection}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        thingsdbActions.removeCollection(collection.name);
        setShow(false);
    };

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Remove'}
                </Button>
            }
            title={`Remove collection ${collection.name}?`}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {/* <ErrorMsg error={serverError} onClose={handleCloseError} /> */}
        </SimpleModal>
    );
};

Remove.propTypes = {
    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Remove;