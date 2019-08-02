import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Things from './Things';
import CollectionInfo from './CollectionInfo';
import RemoveCollection from './Remove';
import RenameCollection from './Rename';
import SetQuotas from './Quotas';
import Query from './Query';
import {StyledTabs, StyledTab} from '../Util/Tabs';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    info: {
        padding: theme.spacing(2),
    },
    things: {
        padding: theme.spacing(2),
    },
}));

const Collection = ({collection}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
  
    const handleChange = (_event, newValue) => setTabIndex(newValue);
    
    return (
        <div className={classes.root}>
            <div >
                <StyledTabs value={tabIndex} onChange={handleChange} aria-label="styled tabs example">
                    <StyledTab label="Collection Info" />
                    <StyledTab label="Things" />
                    <StyledTab label="Query" />
                </StyledTabs>
                {tabIndex === 0 && 
                    <Grid
                        alignItems="stretch"
                        className={classes.info}
                        container
                        direction="column"
                        justify="center"
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <CollectionInfo collection={collection} />
                        </Grid>
                        <Grid item container xs={12} spacing={1} >
                            <Grid item>
                                <RenameCollection collection={collection} />
                            </Grid>
                            <Grid item>
                                <RemoveCollection collection={collection} />
                            </Grid>
                            <Grid item>
                                <SetQuotas collection={collection} />
                            </Grid>
                        </Grid>
                    </Grid>
                }
                {tabIndex === 1 && 
                    <Grid
                        alignItems="stretch"
                        className={classes.things}
                        container
                        direction="column"
                        justify="center"
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <Things collection={collection} />
                        </Grid>
                    </Grid>
                }
                {tabIndex === 2 && 
                    <Grid
                        alignItems="stretch"
                        className={classes.things}
                        container
                        direction="column"
                        justify="center"
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <Query collection={collection} />
                        </Grid>
                    </Grid>
                }
            </div>
        </div>
    );
};

Collection.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default Collection;