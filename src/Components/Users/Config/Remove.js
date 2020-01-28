import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, ErrorMsg, SimpleModal } from '../../Util';
import {ThingsdbActions} from '../../../Stores';


const tag = '22';

const Remove = ({user}) => {
    const [show, setShow] = React.useState(false);
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        setName(user.name);
    }, [user.name]);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        ThingsdbActions.removeUser(
            user.name,
            tag,
            () => null,
        );
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
                <CardButton onClick={handleClickOpen} title="Remove" />
            }
            title={`Remove ${name}`}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            <ErrorMsg tag={tag} />
        </SimpleModal>
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Remove;