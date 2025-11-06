import { amber } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { EditName, SimpleModal } from '../../Utils';
import { ProcedureActions } from '../../../Stores';
import { EditProcedureDialogTAG } from '../../../Constants/Tags';
import { EditProcedure } from '../Content';


const tag = EditProcedureDialogTAG;
const EditProcedureDialog = ({
    button = null,
    open,
    onClose,
    procedure = {},
    scope,
}: Props) => {
    const handleRename = (oldName, newName) => {
        ProcedureActions.renameProcedure(oldName, newName, scope, tag, onClose);
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            maxWidth="md"
            actionButtons={procedure.with_side_effects?(
                <ListItem>
                    <Typography variant="caption" sx={{color: amber[700]}}>
                        {'Note: this procedure generates an event.'}
                    </Typography>
                </ListItem>
            ):null}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} size={12}>
                    <Grid size={8}>
                        <Typography variant="body1" >
                            {'Customizing ThingDB procedure:'}
                        </Typography>
                        <EditName name={procedure.name||''} fn={handleRename} />
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <EditProcedure procedure={procedure} scope={scope} />
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

EditProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default EditProcedureDialog;


interface Props {
    button?: React.ReactElement;
    open: boolean;
    onClose: () => void;
    procedure: Partial<IProcedure>;
    scope: string;
}
