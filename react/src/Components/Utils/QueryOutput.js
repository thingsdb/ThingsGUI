import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { Arguments, EditProvider, replacer, ThingsTree } from '.';
import Copy from './Copy';


const QueryOutput = ({output, onArgs, onChangeTab, tabIndex}) => {

    const handleChangeTab = (_event, newValue) => {
        onChangeTab(newValue);
    };

    const handleArgs = (args) => {
        onArgs(args);
    };

    const jsonOutput = JSON.stringify(output, replacer, 4); // output

    return (
        <Paper sx={{backgroundColor: '#000', padding: '8px', overflowX: 'auto', width: '100%'}}>
            <Tabs value={tabIndex} onChange={handleChangeTab} indicatorColor="primary" aria-label="styled tabs example" sx={{marginBottom: '16px'}}>
                <Tab label="Tree view" />
                <Tab label="JSON view" />
                {onArgs && <Tab label="Arguments" />}
            </Tabs>
            <Collapse in={tabIndex === 0}>
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
            </Collapse>
            <Collapse in={tabIndex === 1}>
                <Grid container>
                    <Grid container item xs={12} justifyContent="flex-end">
                        <Copy text={jsonOutput || ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{overflow: 'auto'}}>
                            <pre>
                                {jsonOutput}
                            </pre>
                        </Box>
                    </Grid>
                </Grid>
            </Collapse>
            {onArgs && (
                <Collapse in={tabIndex === 2}>
                    <EditProvider>
                        <Arguments onChange={handleArgs} />
                    </EditProvider>
                </Collapse>
            )}
        </Paper>
    );
};

QueryOutput.defaultProps = {
    output: null,
    onArgs: null,
};

QueryOutput.propTypes = {
    output: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    onArgs: PropTypes.func,
    onChangeTab: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired
};
export default QueryOutput;
