import React from 'react';
import ReactDOM from 'react-dom';

import { setGlobal } from 'reactn'; // <-- reactn

import '@babel/polyfill';
/* fixes issues on ie */
import Root from './App/Root';

// Set an initial global state directly:
setGlobal({
    loaded: false,
    connected: false,
    connErr: '',
    match: {},
    things: {},
    counters: {},
    nodes: [],
    node: {},
    collections: [],
    collection: {},
    users: [],
    user: {},
    error: {
        msg: {

        },
        toast: [],
    },
});

ReactDOM.render(<Root />, document.getElementById('app'));
