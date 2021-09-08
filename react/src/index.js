import React from 'react';
import ReactDOM from 'react-dom';


import '@babel/polyfill';
/* fixes issues on ie */
import Root from './Components/App';


ReactDOM.render(<Root />, document.getElementById('app'));
