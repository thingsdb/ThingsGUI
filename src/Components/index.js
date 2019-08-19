import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
// /* fixes issues on ie */
import CodeEditor from './Util/CodeEditor';
// // import App from './App/App';


export class Editor extends React.Component {

    componentDidMount() {

        new CodeEditor(this.ele);
    }

    render() {
        return (
            <div style={{height: 400}} ref={(ele) => this.ele = ele} />
        );
    }
}

ReactDOM.render(<Editor />, document.getElementById('app'));