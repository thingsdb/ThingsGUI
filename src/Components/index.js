import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
/* fixes issues on ie */
import {StoreProvider} from '../Stores/BaseStore'; 
import App from './App/App';

/* Docs:
all_
endsswith
counters return value dubbel
node api dingen staan ook in thingsdb api
*/


function Main() {
    return (
        <StoreProvider>
            <App />
        </StoreProvider>
    );
}

ReactDOM.render(<Main />, document.getElementById('app'));
