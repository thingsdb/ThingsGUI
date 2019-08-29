import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import CollectionConfig from './CollectionConfig';
import CollectionTree from './CollectionTree';
import CollectionQuery from './CollectionQuery';
import {CollectionStore} from '../../Stores/CollectionStore';



const withStores = withVlow([{
    store: CollectionStore,
}]);

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        width: '100%'
    },
    config: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        minWidth: '450px',
        width: '40%',
    },
    flex: {
        display: 'flex',
    },
    tree: {
        marginTop: theme.spacing(1),
        width: '60%',
    },
}));

const Collection = ({collection}) => {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <div>
                <Card className={classes.title}>
                    <Typography variant="body1" >
                        {'Overview of: '}
                    </Typography>
                    <Typography variant="h4" color='primary'>
                        {collection.name}
                    </Typography>
                </Card>
            </div>
            <div>
                <CollectionQuery collection={collection} />
            </div>
            <div className={classes.flex}>
                <div className={classes.tree}>
                    <CollectionTree collection={collection} />
                </div>
                <div className={classes.config}>
                    <CollectionConfig collection={collection} />
                </div>
            </div>
        </div>
    );
};

Collection.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default withStores(Collection);