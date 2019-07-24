import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import App from './App';
import AppLoader from './AppLoader';
import Login from './Login';
import {ApplicationStore} from '../../Stores/ApplicationStore';

const theme = createMuiTheme({
    // in case we want to overwrite the default theme
    palette: {
        type: 'light',
        // primary: {
        //     main: '#16113d',
            
        // },
        // secondary: {
            // main: '#e6293f'
        // },
        // background: {
            // default: '#eee',
            // default: '#ddd',
            // paper: '#fff'
        // },
        typography: {
            useNextVariants: true,
        },
    },
});

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['loaded', 'connected']
}]);

const Root = ({loaded, connected}) => (
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {loaded ? connected ? <App /> : <Login /> : <AppLoader />}
    </MuiThemeProvider>
);

Root.propTypes = {
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
};

export default withStores(Root);