import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import { ThingsdbActions, useStore } from '../../Actions/ThingsdbActions';




const Remove = ({user}) => {
    const dispatch = useStore()[1];
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };
    const handleClickOk = () => {
        ThingsdbActions.removeUser(dispatch, user.name);
        setShow(false);
    };



    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title="Remove" />
            }
            title="Remove user?"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        />
        //     <ErrorMsg error={serverError} onClose={handleCloseError} />
        // </SimpleModal>
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Remove;