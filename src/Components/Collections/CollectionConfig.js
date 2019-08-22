import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CollectionInfo from './CollectionInfo';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';

const useStyles = makeStyles(theme => ({
    card: {
        padding: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
}));

const CollectionConfig = ({collection}) => {
    const classes = useStyles();    
    
    return (
        <Card className={classes.card}>
            <Typography className={classes.title}  variant={'h5'} >
                {'INFO'}
            </Typography>
            <CardContent>
                <CollectionInfo collection={collection} />
            </CardContent>
            <CardActions>
                <RenameCollection collection={collection} />  
                <RemoveCollection collection={collection} />
                <SetQuotas collection={collection} />                  
            </CardActions>
        </ Card>

    );
};

CollectionConfig.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionConfig;