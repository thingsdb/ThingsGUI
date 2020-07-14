import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel({ children, value, index }) {

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(1),
        minWidth: 150,
    },
    panels: {
        maxWidth: '80%',
    },
}));

export default function VerticalTabs({headers, panels}) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                {headers.map((v, i)=>(
                    <Tab key={i} label={v} />
                ))}
            </Tabs>
            {panels.map((v, i)=>(
                <TabPanel className={classes.panels} key={i} value={value} index={i}>
                    {v}
                </TabPanel>
            ))}

        </div>
    );
}