import PropTypes from 'prop-types';
import React from 'react';
import Link from '@material-ui/core/Link';

import {revealCustomType} from '../../../Util';

const AddLink = ({name, items, onChange}) => {
    console.log(name, items)
    let stripped = revealCustomType(name);
    return( items.includes(stripped)? (
        <React.Fragment>
            {name.length-stripped.length>1?name[0]:null}
            <Link component="button" onClick={onChange(stripped)}>
                {stripped}
            </Link>
            {name.length-stripped.length>2?name.slice(stripped.length-name.length+1):name.length-stripped.length>0?name.slice(-1):null}
        </React.Fragment>
    ) : (name));
};

AddLink.defaultProps = {
    name: "",
    items: [],
};

AddLink.propTypes = {
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
};

export default AddLink;