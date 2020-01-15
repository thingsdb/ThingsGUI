import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import App from './App';
import AppLoader from './AppLoader';
import Login from './Login';
import {ApplicationActions, ApplicationStore, EventActions, EventStore} from '../../Stores';

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
    keys: ['loaded', 'connected']
}, {
    store: EventStore,
}]);

const Root = ({loaded, connected}) => {
    React.useEffect(() => {
        ApplicationActions.pushNotifications();
        EventActions.openEventChannel();
    },
    [],
    );

    return(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {loaded ? connected ? <App /> : <Login /> : <AppLoader />}
        </MuiThemeProvider>
    );
};

Root.propTypes = {
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
};

export default withStores(Root);