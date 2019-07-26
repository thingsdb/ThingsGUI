import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Collection from './Collection';
import CollectionExtend from './CollectionExtend';
import Table from '../Util/Table2';


const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > div': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#635ee7',
        },
    },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        //color: '#fff',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        '&:focus': {
        opacity: 1,
        },
    },
}))(props => <Tab disableRipple {...props} />);

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
    const [value, setValue] = React.useState(0);

    const rows = [collection];
    const header = [{
        ky: 'name',
        label: 'Collection',
    }, {
        ky: 'things',
        label: '# Things',
    }];

    const rowExtend = (collection) => <CollectionExtend collection={collection} />;
  
    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div className={classes.root}>
            <div className={classes.demo2}>
                <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
                    <StyledTab label="Collection Info" />
                    <StyledTab label="Things" />
                </StyledTabs>
                <div>
                    {value === 0 && <Table header={header} rows={rows} rowExtend={rowExtend} />}
                    {value === 1 && <Collection collection={collection} />}
                </div>    
            </div>
        </div>
    );
};

Collections.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default Collections;