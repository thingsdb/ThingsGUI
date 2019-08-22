import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CollectionInfo from './CollectionInfo';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';

const useStyles = makeStyles(theme => ({
    buttons: {
        width: '40%',
    },
    card: {
        width: '60%',
        padding: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    flex: {
        display: 'flex',
    },
    title: {
        marginBottom: theme.spacing(2),
    },
}));

const CollectionConfig = ({collection}) => {
    const classes = useStyles();    

    const buttons = [
        {
            name: 'quotas',
            component: <SetQuotas collection={collection} />  
        },
        {
            name: 'rename',
            component: <RenameCollection collection={collection} /> 
        },
        {
            name: 'remove',
            component: <RemoveCollection collection={collection} />
        },
    ]
    
    return (
        <div className={classes.flex}>
            <Card className={classes.card}>
                <Typography className={classes.title}  variant={'h5'} >
                    {'INFO'}
                </Typography>
                <CardContent>
                    <CollectionInfo collection={collection} />
                </CardContent>
            </ Card>
            <Grid className={classes.buttons} container spacing={1} direction={'row'} justify={'center'} alignItems={'center'} >
                {buttons.map(button => (
                    <Grid key={button.name} item>
                        {button.component}
                    </Grid>
                ))}
            </Grid>
        </div>

    );
};

CollectionConfig.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionConfig;