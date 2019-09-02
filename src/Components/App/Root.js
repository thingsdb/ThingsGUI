import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import App from './App';
import AppLoader from './AppLoader';
import Login from './Login';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {ErrorToast} from '../Util';

const theme = createMuiTheme({
    // in case we want to overwrite the default theme
    palette: {
        type: 'dark',
        primary: {
            main: 'rgba(85, 161, 255, 0.51)',
        },
        secondary: {
            main: 'rgba(0, 55, 123, 0.3)',
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
}]);

const Root = ({loaded, connected}) => {
    const [serverErrors, setServerErrors] = React.useState([]);

    React.useEffect(() => {
        setServerErrors([]);
    },
    [connected]
    );

    const handleServerError = (err) => {
        setServerErrors(prevErr => {
            const newArray = [...prevErr];
            newArray.push(err.log);
            return newArray;
        });
    };

    return(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {loaded ? connected ? <App onError={handleServerError} /> : <Login /> : <AppLoader onError={handleServerError} />}
            <ErrorToast errors={serverErrors} />
        </MuiThemeProvider>
    );
};

Root.propTypes = {
    loaded: ApplicationStore.types.loaded.isRequired,
    connected: ApplicationStore.types.connected.isRequired,
};

export default withStores(Root);