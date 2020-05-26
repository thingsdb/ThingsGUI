/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const TypeInit = ({child, customTypes, dataTypes, cb}) => {
    const [dataType, setDataType] = React.useState(child.type=='list'||child.type=='thing' ? dataTypes[0]: child.type=='set' ? 'thing' : child.type);

    React.useEffect(()=>{
        cb(dataType);
    }, [dataType]);

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        setDataType(value);
    };

    return(
        <TextField
            margin="dense"
            autoFocus
            name="dataType"
            label="Data type"
            value={dataType}
            onChange={handleOnChangeType}
            select
            SelectProps={{native: true}}
        >
            {dataTypes.map((d, i) => (
                <option key={i} value={d} disabled={child.type=='set'&&!(d=='thing'||Boolean(customTypes.find(c=>c.name==d)))} >
                    {d}
                </option>
            ))}
        </TextField>
    )
};


TypeInit.propTypes = {
    cb: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TypeInit;