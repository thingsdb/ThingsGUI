/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {EditActions, useEdit} from '../Context';
import AddCode from './AddCode';


const AddType = ({identifier, label, link, numLines, parent, type}) => {
    const [, dispatch] = useEdit();

    React.useEffect(()=>{
        if (type) {
            EditActions.update(dispatch, 'val', `${type}()`, identifier, parent);
        }
    }, [type]);

    return(
        <AddCode identifier={identifier} label={label} link={link} numLines={numLines} parent={parent} />
    );
};

AddType.defaultProps = {
    identifier: null,
    type: '',
},

AddType.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    numLines: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
};

export default AddType;