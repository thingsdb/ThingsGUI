/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {BoolInput} from '../..';
import {EditActions, useEdit} from '../Context';

const isTrue = (str) => str === 'true';

const AddBool = ({
    identifier = null,
    init = '',
    parent
}: Props) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(() => {
        if (init) {
            EditActions.update(dispatch, 'val', init, identifier, parent);
            EditActions.update(dispatch, 'obj', isTrue(init), identifier, parent);
        }
    }, []);

    const handleOnChange = (b) => {
        EditActions.update(dispatch, 'val', b, identifier, parent);
        EditActions.update(dispatch, 'obj', isTrue(b), identifier, parent);
    };

    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

    return(
        <BoolInput input={`${v}`} onChange={handleOnChange} />
    );
};

AddBool.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    parent: PropTypes.string.isRequired,
};

export default AddBool;

interface Props {
    identifier: string | number;
    init: boolean | string;
    parent: string;
}
