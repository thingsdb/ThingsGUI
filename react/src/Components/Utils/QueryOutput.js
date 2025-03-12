import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { Arguments, EditProvider, Logging, replacer, ThingsTree } from '.';
import { EditorTab } from '../../Constants/Enums';
import Copy from './Copy';


const QueryOutput = ({
    output = null,
    onArgs = null,
    onChangeTab,
    showLogs = false,
    tabIndex,
}) => {

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
                {showLogs && <Tab label="Logging" />}
            </Tabs>
            <Collapse in={tabIndex === EditorTab.TREE}>
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
            <Collapse in={tabIndex === EditorTab.JSON}>
                <Grid container>
                    <Grid container xs={12} justifyContent="flex-end">
                        <Copy text={jsonOutput || ''} />
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{overflow: 'auto'}}>
                            <pre>
                                {jsonOutput}
                            </pre>
                        </Box>
                    </Grid>
                </Grid>
            </Collapse>
            {onArgs && (
                <Collapse in={tabIndex === EditorTab.ARGUMENTS}>
                    <EditProvider>
                        <Arguments onChange={handleArgs} />
                    </EditProvider>
                </Collapse>
            )}
            {showLogs && (
                <Collapse in={tabIndex === EditorTab.LOG}>
                    <Logging />
                </Collapse>
            )}
        </Paper>
    );
};

QueryOutput.propTypes = {
    onArgs: PropTypes.func,
    onChangeTab: PropTypes.func.isRequired,
    output: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    showLogs: PropTypes.bool,
    tabIndex: PropTypes.number.isRequired
};
export default QueryOutput;
