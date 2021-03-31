import Paper from '@material-ui/core/Paper';
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles} from '@material-ui/core/styles';

import {ThingsTree} from '../Util';

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
                <pre>
                    {jsonOutput}
                </pre>
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
