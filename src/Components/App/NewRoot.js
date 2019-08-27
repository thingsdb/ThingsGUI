import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import {withVlow} from 'vlow';

import App from './App';
import AppLoader from './AppLoader';
import Login from './Login';
import {useStore} from '../../Stores/NewBaseStore';
import ApplicationStore from '../../Stores/NewApplicationStore';
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

const Store = new ApplicationStore;

const Root = () => {
    const [serverErrors, setServerErrors] = React.useState([]);
    const useApplicationStore = useStore(Store, ['loaded', 'connected']);

    const store = useApplicationStore;
    const {loaded, connected} = store.state;

    React.useEffect(() => {
        store.connected();
    }, []);

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

export default Root;