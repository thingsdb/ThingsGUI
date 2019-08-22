import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import CollectionConfig from './CollectionConfig';
import OverviewQuery from './OverviewQuery';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        width: '100%'
    },
    config: {
        marginBottom: theme.spacing(1),
        minWidth: '450px',
        width: '100%',
    },
    query: {
        width: '100%',
    },
}));

const Collection = ({collection}) => {
    const classes = useStyles();

    
    return (
        <div className={classes.root}>
            <div>
                <Card className={classes.card}>
                    <Typography variant="h6" >
                        {'Overview of: '}
                    </Typography>
                    <Typography variant="h4" color='primary'>
                        {collection.name}
                    </Typography>
                </Card>
            </div>
            <div>
                <div className={classes.config}>
                    <CollectionConfig collection={collection} />
                </div>
                <div className={classes.query}>
                    <OverviewQuery collection={collection} />
                </div>
            </div>
        </div>    
    );
};

Collection.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default Collection;