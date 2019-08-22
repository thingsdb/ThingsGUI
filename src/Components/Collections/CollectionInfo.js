import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';


const CollectionInfo = ({collection}) => {
    const header = [
        {ky: 'collection_id', label: 'Collection ID'},
        {ky: 'name', label: 'Name'},
        {ky: 'quota_array_size', label: 'Quota on array size'},
        {ky: 'quota_properties', label: 'Quota on properties'},
        {ky: 'quota_raw_size', label: 'Quota on raw size'},
        {ky: 'quota_things', label: 'Quota on things'},
        {ky: 'things', label: 'Things stored'},
    ];
    
    return (
        <Grid container spacing={0}>
            {header.map((h) => (
                <React.Fragment key={h.ky}>
                    <Grid item xs={7}>
                        <Typography variant={'caption'} >
                            {h.label + ':'}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant={'subtitle2'} >
                            {collection[h.ky] !== null ? collection[h.ky] : 'Not set'}
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    );
};

CollectionInfo.propTypes = {
    collection: PropTypes.object.isRequired
};

export default CollectionInfo;