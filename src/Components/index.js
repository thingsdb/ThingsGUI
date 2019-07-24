import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
/* fixes issues on ie */
import Root from './App/Root';


ReactDOM.render(<Root />, document.getElementById('app'));
