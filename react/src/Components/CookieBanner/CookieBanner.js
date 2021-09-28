import { styled } from '@mui/material/styles';
import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

import { ApplicationActions } from '../../Stores';

const RootGrid = styled(Grid)(({ theme }) => ({
    position: 'fixed',
    left: 0,
    bottom: 0,
    backgroundColor: 'black',
    color: 'white',
    opacity: '85%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2, 5, 2, 5)
    },
    zIndex: 3000
}));

function CookieBanner() {
    const [cookiesAccepted, setCookiesAccepted] = useState(
        localStorage.getItem('thingsgui.cookiesAllowed') === 'true' ? true
            : localStorage.getItem('thingsgui.cookiesAllowed') === 'false' ? false
                : localStorage.getItem('thingsgui.cookiesAllowed'));

    React.useEffect(() => {
        if (cookiesAccepted) {
            ApplicationActions.storeSession();
        }
    }, [cookiesAccepted]);

    const AcceptCookies = () => {
        // Store Cookies consent
        localStorage.setItem('thingsgui.cookiesAllowed', true);
        setCookiesAccepted(true);
    };

    const DeclineCookies = () => {
        // Store Cookies consent
        localStorage.setItem('thingsgui.cookiesAllowed', false);
        setCookiesAccepted(false);
    };

    if (cookiesAccepted == null) {
        return (
            <RootGrid container alignItems="center" justifyContent="center" spacing={2}>
                <Grid item>
                    <Typography>
                        {'This site uses only necessary cookies to remember the last login. Do you consent to the use of these cookies?'}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={AcceptCookies}
                    >
                        {'Accept Cookies'}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        color="default"
                        variant="text"
                        onClick={DeclineCookies}
                    >
                        {'Decline Cookies'}
                    </Button>
                </Grid>
            </RootGrid>
        );
    }
    else {
        return null;
    }
}

export default CookieBanner;