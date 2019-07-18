import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
/* fixes issues on ie */
import {AppProvider} from '../Stores/ApplicationStore';
import App from './App/App';


function Main() {
    return (
        <AppProvider>
            <App />
        </AppProvider>
    );
}

ReactDOM.render(<Main />, document.getElementById('app'));
