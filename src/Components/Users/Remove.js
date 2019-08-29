import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import ThingsdbActions from '../../Actions/ThingsdbActions';


const thingsActions = new ThingsdbActions();

const Remove = ({user}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };
    const handleClickOk = () => {
        thingsActions.removeUser(user.name);
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