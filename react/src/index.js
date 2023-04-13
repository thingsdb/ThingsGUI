import React from 'react';
import { createRoot } from 'react-dom/client';
import '@babel/polyfill';

/* fixes issues on ie */
import Root from './Components/App';


const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Root />);
