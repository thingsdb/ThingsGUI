import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import {ThingsTree} from '.';
import Copy from './Copy';

const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: '#000',
        padding: theme.spacing(1),
        overflowX: 'auto',
        width: '100%'

    },
    tabs: {
        marginBottom: theme.spacing(2),
    },
}));


const QueryOutput = ({output}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);
    };

    const replacer = (_key, value) => typeof value === 'string' && value.includes('download/tmp/thingsdb-cache-') ? '<blob data>' : value;
    const jsonOutput = JSON.stringify(output, replacer, 4); // output

    return (
        <Paper className={classes.card} >
            <Tabs className={classes.tabs} value={tabIndex} onChange={handleChangeTab} indicatorColor="primary" aria-label="styled tabs example">
                <Tab label="Tree view" />
                <Tab label="JSON view" />
            </Tabs>
            {tabIndex === 0 &&
                <List
                    component="nav"
                    dense
                    disablePadding
                >
                    <ThingsTree
                        tree={output}
                        child={{
                            name:'',
                            index:null,
                        }}
                        root
                    />
                </List>
            }
            {tabIndex === 1 &&
                <Grid container>
                    <Grid container item xs={12} justifyContent="flex-end">
                        <Copy text={jsonOutput || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box overflow="auto">
                            <pre>
                                {jsonOutput}
                            </pre>
                        </Box>
                    </Grid>
                </Grid>
            }
        </Paper>
    );
};

QueryOutput.defaultProps = {
    output: null,
};

QueryOutput.propTypes = {
    output: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};
export default QueryOutput;
