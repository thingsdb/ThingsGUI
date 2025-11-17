import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { InputField, useEdit } from '../../Utils';
import { BOOL, FLOAT, INT, LIST, NIL, STR, THING, VARIABLE } from '../../../Constants/ThingTypes';

const dataTypes = [BOOL, FLOAT, INT, LIST, NIL, STR, THING]; // Supported types

const SetArguments = ({
    closure = '',
    onChange,
}: Props) => {
    const editState = useEdit()[0];
    const {blob, obj} = editState;

    let argLabels = (closure.split('|')[1] || '').split(',').slice(1);

    React.useEffect(() => {
        let values = Object.values(obj);
        onChange(values, blob);
    }, [blob, onChange, obj]);

    return (
        argLabels?.length ? (
            <InputField dataType={VARIABLE} dataTypes={dataTypes} variables={argLabels} />
        ) : (
            <Typography variant="subtitle2">
                <Box sx={{fontStyle: 'italic', m: 2, color: (theme) => theme.palette.text.secondary}}>
                    {'No arguments'}
                </Box>
            </Typography>
        )
    );
};

SetArguments.propTypes = {
    closure: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default SetArguments;


interface Props {
    closure: string;
    onChange: (values: unknown[], blob: object) => void;
}
