/*eslint-disable react/jsx-props-no-spreading*/
/*eslint-disable react/no-multi-comp*/
import { useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
// import {version} from '../../package.json';

import {TopBar} from '../Navigation';
import DashboardContent from './DashboardContent';

const version='version: 1.3.0';

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="down" ref={ref} {...props} mountOnEnter unmountOnExit />;
});

const DashboardPage = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = React.useState(() => {
        let dashboardParam = searchParams.get('dashboard');
        if (dashboardParam) {
            return true;
        }
        return false;
    });

    const handleOpen = () => {
        const current = Object.fromEntries(searchParams);
        setSearchParams({ ...current, dashboard: true });
        setOpen(true);
    };

    const handleClose = () => {
        const dashboard = searchParams.has('dashboard');
        if (dashboard) {
            searchParams.delete('dashboard');
            setSearchParams(searchParams);
        }
        setOpen(false);
    };

    return(
        <div>
            <Button variant="text" color="primary" onClick={handleOpen}>
                <img
                    alt="ThingsDB Logo"
                    src="/img/thingsgui-logo.png"
                    draggable='false'
                    height={35}
                />
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <DashboardContent />
                <div style={{position:'fixed', width: '100%', bottom: -8, zIndex: 2}}>
                    <TopBar
                        title={
                            <Typography variant="button" color="textPrimary">
                                {version}
                            </Typography>
                        }
                        pageIcon={
                            <IconButton edge="start" onClick={handleClose} aria-label="close">
                                <ExpandLessIcon />
                            </IconButton>
                        }
                    />
                </div>
            </Dialog>

        </div>
    );
};

export default DashboardPage;