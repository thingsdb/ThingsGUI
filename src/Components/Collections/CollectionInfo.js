import PropTypes from 'prop-types';
import React from 'react';
import { Info } from '../Util';


const CollectionInfo = ({collection}) => {
    const header = [
        {ky: 'title1', title: '[TITLE1]', labels: [
            {ky: 'collection_id', label: 'Collection ID'},
            {ky: 'name', label: 'Name'},
            {ky: 'things', label: 'Things stored'},
        ]},
        {ky: 'title2', title: '[TITLE2]', labels: [
            {ky: 'quota_array_size', label: 'Quota on array size'},
            {ky: 'quota_properties', label: 'Quota on properties'},
            {ky: 'quota_raw_size', label: 'Quota on raw size'},
            {ky: 'quota_things', label: 'Quota on things'},
        ]}
    ];
    
    return (
        <Info header={header} content={collection}/>
    );
};

CollectionInfo.propTypes = {
    collection: PropTypes.object.isRequired
};

export default CollectionInfo;