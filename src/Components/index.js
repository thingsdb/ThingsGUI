import React from 'react';
import ReactDOM from 'react-dom';

import { setGlobal } from 'reactn'; // <-- reactn

import '@babel/polyfill';
/* fixes issues on ie */
import Root from './App/Root';

// Set an initial global state directly:
setGlobal({
    cards: [],
    disabled: false,
    initial: 'values',
    x: 1,
});

ReactDOM.render(<Root />, document.getElementById('app'));
