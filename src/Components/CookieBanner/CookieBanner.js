import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import {ApplicationActions} from '../../Stores';

const useStyles = makeStyles(theme => ({
    root: {
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
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: {
            justifyContent: 'right',
        }
    }
}));

function CookieBanner() {
    const classes = useStyles();
    const [cookiesAccepted, setCookiesAccepted] = useState(localStorage.getItem('thingsgui.cookiesAllowed'));

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

    if (!cookiesAccepted) {
        return (
            <Grid container alignItems="center" justify="center" className={classes.root} spacing={2}>
                <Grid item xs={12} sm={10}>
                    <Typography>
                        {'This site uses only necessary cookies which are required for access restrictions. By using our site, you consent to our use of cookies.'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={2} className={classes.button}>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={AcceptCookies}
                    >
                        {'Accept Cookies'}
                    </Button>
                </Grid>
            </Grid>
        );
    }
    else {
        return null;
    }
}

export default CookieBanner;