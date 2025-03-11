import { HashRouter as Router } from 'react-router';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import { withVlow } from 'vlow';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

import { ApplicationActions, ApplicationStore } from '../../Stores';
import { AuthTAG, LoginTAG } from '../../Constants/Tags';
import App from './App';
import AppLoader from './AppLoader';
import Auth from './Auth';
import CookieBanner from '../CookieBanner';
import InitStores from './InitStores';
import Login from './Login';

const theme = createTheme({
    // in case we want to overwrite the default theme
    palette: {
        mode: 'dark',
        primary: {
            main: '#3a5985',
            yellow: '#ecda45',
            green: '#4ca024',
            warning: '#5a0c18d9'
        },
        secondary: {
            main: '#193352',
        },
        background: {
            default: '#2e3336',
            paper: '#1e2224'
        },
        typography: {
            useNextVariants: true,
        },
        text: {
            primary: '#eee',
            secondary: '#aaa'
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    '*::-webkit-scrollbar': {
                        width: '0.7em',
                        height: '0.6em'
                    },
                    '*::-webkit-scrollbar-track': {
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: '#3a5985',
                        outline: '1px solid #3a5985'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: { root: { backgroundImage: 'unset' } },
        },
    }
});


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['authOnly', 'loaded', 'connected', 'seekConnection', 'useCookies']
}]);

const Root = ({authOnly, loaded, connected, seekConnection, useCookies}) => {
    React.useEffect(() => {
        const key = (new URL(window.location)).searchParams.get('key');
        ApplicationActions.isAuthOnly();
        ApplicationActions.getCachedConn(LoginTAG); // errmsg shown at Login dialog
        if(key){
            ApplicationActions.authKey(key, AuthTAG);
        }
    }, []);

    return(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <InitStores />
                <Router>
                    {loaded ? (
                        connected ? <App />
                            : authOnly ? <Auth /> : <Login />
                    ) : <AppLoader connect={seekConnection} />}
                </Router>
                {useCookies && <CookieBanner />}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

Root.propTypes = {
    authOnly: ApplicationStore.types.authOnly.isRequired,
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
    seekConnection: ApplicationStore.types.seekConnection.isRequired,
    useCookies: ApplicationStore.types.useCookies.isRequired,
};

export default withStores(Root);