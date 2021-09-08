import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';


import {useEdit} from '../../CollectionsUtils';


const SubmitButton = ({disabled, onClickSubmit}) => {
    const editState = useEdit()[0];
    const {query, blob, error} = editState;

    const handleClickOk = () => {
        onClickSubmit(blob, query);
    };

    return (
        <Button onClick={handleClickOk} disabled={disabled||Boolean(error)} color="primary">
            {'Submit'}
        </Button>
    );
};

SubmitButton.defaultProps = {
    disabled: false,
};


SubmitButton.propTypes = {
    disabled: PropTypes.bool,
    onClickSubmit: PropTypes.func.isRequired,
};

export default SubmitButton;

