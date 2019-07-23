import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
/* fixes issues on ie */
import App from './App/App';


ReactDOM.render(<App />, document.getElementById('app'));
