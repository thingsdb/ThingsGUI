import { useLocation, useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import { historyNavigate, RemoveModal } from '../../Utils';
import { ProcedureActions, TaskActions } from '../../../Stores';
import { RemoveProcedureTAG } from '../../../Constants/Tags';


const tag = RemoveProcedureTAG;

const Remove = ({item, scope, type}: Props) => {
    let navigate = useNavigate();
    let location = useLocation();
    const name = type === 'procedure' ? item.name : item.id;

    const handleClickOk = () => {
        let fn = type === 'procedure' ? ProcedureActions.deleteProcedure : TaskActions.deleteTask;
        fn(scope, name, tag, () => historyNavigate(navigate, location, '/'));
    };

    return(
        <RemoveModal
            buttonComponent={Button}
            buttonLabel="Remove"
            buttonProps={{variant: 'outlined', color: 'primary'}}
            onSubmit={handleClickOk}
            tag={tag}
            title={name ? `Remove '${name}'` : ''}
        />
    );
};

Remove.propTypes = {
    item: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Remove;

interface Props {
    item: Partial<IProcedure> | Partial<ITask>;
    scope: string;
    type: string;
}