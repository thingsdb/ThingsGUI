import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, ErrorMsg, SimpleModal } from '../../Util';
import {ProcedureActions, TimerActions} from '../../../Stores';
import {RemoveProcedureTAG} from '../../../constants';


const tag = RemoveProcedureTAG;

const Remove = ({item, scope, close, type}) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    let identifier = type === 'procedure' ? item.name : item.id;

    React.useEffect(() => {
        setName(identifier);
    }, [identifier]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    const handleClickOk = () => {
        let fn = type === 'procedure' ? ProcedureActions.deleteProcedure : TimerActions.deleteTimer
        fn(scope, identifier, tag, close ? handleClickClose : () => null);
    };

    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title="Remove" />
            }
            title={`Remove ${name}`}
            open={open}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            <ErrorMsg tag={tag} />
        </SimpleModal>
    );
};

Remove.defaultProps = {
    close: false,
};

Remove.propTypes = {
    item: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    close: PropTypes.bool,
    type: PropTypes.string.isRequired,
};

export default Remove;