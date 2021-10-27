import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import {CardButton, ErrorMsg, historyNavigate, SimpleModal} from '../../Utils';
import {ThingsdbActions} from '../../../Stores';
import {RemoveUserTAG} from '../../../Constants/Tags';


const tag = RemoveUserTAG;

const Remove = ({user}) => {
    let history = useHistory();
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
            () => historyNavigate(history, '/'),
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