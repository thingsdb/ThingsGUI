import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './App';
import AppLoader from './AppLoader';
import Login from './Login';
import {ErrorToast} from '../Util';
import {useStore} from '../../Actions/ApplicationActions';

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



const Root = () => {
    // const [serverErrors, setServerErrors] = React.useState([]);
    const store = useStore()[0];
    const {connected, loaded} = store;
    // React.useEffect(() => {
    //     setServerErrors([]);
    // },
    // [connected]
    // );

    // const handleServerError = (err) => {
    //     setServerErrors(prevErr => {
    //         const newArray = [...prevErr];
    //         newArray.push(err.log);
    //         return newArray;
    //     });
    // };

    return(
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {loaded ? connected ? <App /> : <Login /> : <AppLoader />}
            {/* <ErrorToast errors={serverErrors} /> */}
        </MuiThemeProvider>
    );
};



export default Root;