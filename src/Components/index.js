import React from 'react';
import ReactDOM from 'react-dom';

import '@babel/polyfill';
/* fixes issues on ie */
import {StoreProvider} from '../Actions/BaseActions';
import Root from './App/Root';



function Main() {
    return (
        <StoreProvider>
            <Root />
        </StoreProvider>
    );
}

ReactDOM.render(<Main />, document.getElementById('app'));
