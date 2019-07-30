import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Collection from './Collection';
import CollectionExtend from './CollectionExtend';
import Table from '../Util/Table2';
import {StyledTabs, StyledTab} from '../Util/Tabs';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    demo2: {
        //backgroundColor: '#2e1534',
    },
}));

const Collections = ({collection}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);

    const rows = [collection];
    const header = [{
        ky: 'name',
        label: 'Collection',
    }, {
        ky: 'things',
        label: '# Things',
    }];

    const rowExtend = (collection) => <CollectionExtend collection={collection} />;
  
    const handleChange = (_event, newValue) => setTabIndex(newValue);

    return (
        <div className={classes.root}>
            <div className={classes.demo2}>
                <StyledTabs value={tabIndex} onChange={handleChange} aria-label="styled tabs example">
                    <StyledTab label="Collection Info" />
                    <StyledTab label="Things" />
                </StyledTabs>
                <div>
                    {tabIndex === 0 && <Table header={header} rows={rows} rowExtend={rowExtend} />}
                    {tabIndex === 1 && <Collection collection={collection} />}
                </div>    
            </div>
        </div>
    );
};

Collections.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default Collections;