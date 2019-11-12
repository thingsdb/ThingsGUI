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
        backgroundColor: '#141719',
        //minHeight: 'calc(100vh - 60vh)',
        padding: theme.spacing(2),
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

    const jsonOutput = output != null ? JSON.stringify(output, null, 4).replace(/"http:\/\/.*download?\/tmp\/thingsdb-cache-.*"/gi, '<blob data>') : null;

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
                    {output != null ? (
                        <ThingsTree
                            tree={output}
                            child={{
                                name:'',
                                index:null,
                            }}
                        />
                    ) :  null}
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
