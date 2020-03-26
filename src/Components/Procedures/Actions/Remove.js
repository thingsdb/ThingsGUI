import PropTypes from 'prop-types';
import React from 'react';

import { CardButton, ErrorMsg, SimpleModal } from '../../Util';
import {ProcedureActions} from '../../../Stores';


const tag = '18';

const Remove = ({procedure, scope, close}) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        setName(procedure.name);
    }, [procedure.name]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    const handleClickOk = () => {
        ProcedureActions.deleteProcedure(
            scope,
            procedure.name,
            tag,
            close?handleClickClose:()=>null,
        );
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
    procedure: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    close: PropTypes.bool,
};

export default Remove;