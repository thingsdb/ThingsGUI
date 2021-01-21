import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import App from './App';
import AppLoader from './AppLoader';
import Auth from './Auth';
import Login from './Login';
import InitStores from './InitStores';
import {ApplicationActions, ApplicationStore} from '../../Stores';
import {LoginTAG} from '../../constants';

const theme = createMuiTheme({
    // in case we want to overwrite the default theme
    palette: {
        type: 'dark',
        primary: {
            main: 'rgba(85, 161, 255, 0.51)',
            red: '#ff0831',
            orange: '#ff7833',
            yellow: '#ecda45',
            green: '#4ca024',
            blue: '#3392ff',
            pink: '#c523a0',
            lightPink: '#ff5a8f',
            purple: '#9256bd',
            cyan: '#16c3b6',
            beige: '#ead0ae',
            white: '#fff',
            warning: '#5a0c18d9'
        },
        secondary: {
            main: '#193352',
        },
        tertiary: {
            main: '#304765',
        },
        background: {
            default: '#2E3336',
            paper: '#1E2224'
        },
        typography: {
            useNextVariants: true,
        },
        text: {
            primary: '#eee',
            secondary: '#00000'
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '*::-webkit-scrollbar': {
                    width: '0.7em',
                    height: '0.6em'
                },
                '*::-webkit-scrollbar-track': {
                    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(85, 161, 255, 0.51)',
                    outline: '1px solid slategrey'
                }
            }
        }
    }
});


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['authOnly', 'loaded', 'connected', 'seekConnection']
}]);

const Root = ({authOnly, loaded, connected, seekConnection}) => {
    React.useEffect(() => {
        ApplicationActions.pushNotifications();
        const key = (new URL(window.location)).searchParams.get('key');
        ApplicationActions.isAuthOnly();
        ApplicationActions.getCachedConn(LoginTAG); // errmsg shown at Login dialog
        if(key){
            ApplicationActions.authKey(key);
        }
    },
    [],
    );

    return(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <InitStores />
            {loaded ? (
                connected ? <App />
                    : authOnly ? <Auth /> : <Login />
            ) : <AppLoader connect={seekConnection} />}
        </MuiThemeProvider>
    );
};

Root.propTypes = {
    authOnly: ApplicationStore.types.authOnly.isRequired,
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
    seekConnection: ApplicationStore.types.seekConnection.isRequired,
};

export default withStores(Root);