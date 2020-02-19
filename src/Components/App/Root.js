import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import App from './App';
import AppLoader from './AppLoader';
import Login from './Login';
import InitStores from './InitStores';
import {ApplicationActions, ApplicationStore} from '../../Stores';

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
            main: 'rgba(0, 55, 123, 0.3)',
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
});


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['loaded', 'connected', 'seekConnection']
}]);

const Root = ({loaded, connected, seekConnection}) => {
    React.useEffect(() => {
        ApplicationActions.pushNotifications();
        ApplicationActions.getConn('0'); // errmsg shown at Login dialog
    },
    [],
    );

    return(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <InitStores />
            {loaded ? connected ? <App /> : <Login /> : <AppLoader connect={seekConnection} />}
        </MuiThemeProvider>
    );
};

Root.propTypes = {
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
    seekConnection: ApplicationStore.types.seekConnection.isRequired,
};

export default withStores(Root);