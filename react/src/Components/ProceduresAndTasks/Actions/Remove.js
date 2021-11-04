import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import { ErrorMsg, historyNavigate, SimpleModal } from '../../Utils';
import { ProcedureActions, TaskActions } from '../../../Stores';
import { RemoveProcedureTAG } from '../../../Constants/Tags';


const tag = RemoveProcedureTAG;

const Remove = ({item, scope, type}) => {
    let history = useHistory();
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
        let fn = type === 'procedure' ? ProcedureActions.deleteProcedure : TaskActions.deleteTask;
        fn(scope, identifier, tag, () => historyNavigate(history, '/'));
    };

    return(
        <SimpleModal
            button={
                <Button color="primary" onClick={handleClickOpen} variant="outlined">
                    {'Remove'}
                </Button>
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

Remove.propTypes = {
    item: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Remove;