import { Info } from '../../Util';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {DATE_TIME_SEC_STR} from '../../../Constants/DateStrings';


const CollectionInfo = ({collection}) => {
    const header = [
        {ky: 'title1', title: 'GENERAL', labels: [
            {ky: 'collection_id', label: 'Collection ID'},
            {ky: 'name', label: 'Name'},
            {ky: 'things', label: 'Things stored'},
            {ky: 'created_at', label: 'Created on'},
        ]},
    ];
    const rows = JSON.parse(JSON.stringify(collection)); //copy
    rows.created_at = moment(rows.created_at*1000).format(DATE_TIME_SEC_STR);

    return (
        <Info header={header} content={rows} />
    );
};

CollectionInfo.propTypes = {
    collection: PropTypes.object.isRequired
};

export default CollectionInfo;