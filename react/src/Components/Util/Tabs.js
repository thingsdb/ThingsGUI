/*eslint-disable react/no-multi-comp*/
import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const TabPanel = ({ children, value, index }) => {

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
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

const VerticalTabs = ({headers, panels}) => {
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
};

VerticalTabs.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    panels: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default VerticalTabs;