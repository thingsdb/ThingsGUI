/*eslint-disable react/no-multi-comp*/
import { styled } from '@mui/material/styles';
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const TabPanel = ({ children, value, index }: TabPanelProps) => (
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

TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


const Root = styled('div')(({theme}) => ({
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
}));

const StyledTabs = styled(Tabs)(({theme}) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(1),
    minWidth: 150,
}));


const VerticalTabs = ({headers, panels}: Props) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    return (
        <Root>
            <StyledTabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
            >
                {headers.map((v, i)=>(
                    <Tab key={i} label={v} />
                ))}
            </StyledTabs>
            {panels.map((v, i)=>(
                <TabPanel key={i} value={value} index={i}>
                    {v}
                </TabPanel>
            ))}

        </Root>
    );
};

VerticalTabs.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    panels: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default VerticalTabs;

interface Props {
    headers: string[];
    panels: object[];
}
interface TabPanelProps {
    children: React.ReactNode;
    index: number;
    value: number;
}