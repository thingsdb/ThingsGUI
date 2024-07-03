import PropTypes from 'prop-types';
import React from 'react';

import AddLink from './AddLink';


const Relation = ({
    onChange,
    relation = null,
    scope,
    view
}) => {

    return(relation ? (
        <React.Fragment>
            {`${relation.property} on `}
            <AddLink name={relation.type} scope={scope} onChange={onChange(view)} />
            {' as '}
            <AddLink name={relation.definition} scope={scope} onChange={onChange(view)} />
        </React.Fragment>
    ) : 'no relation');
};

Relation.propTypes = {
    onChange: PropTypes.func.isRequired,
    relation: PropTypes.object,
    scope: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
};

export default Relation;