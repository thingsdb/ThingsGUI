import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';

import Language from './Language.js';
import * as monaco from 'monaco-editor';

monaco.languages.register({ id: 'mySpecialLanguage' });

monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
    defaultToken: 'invalid',
    // tokenPostfix: '',

    keywords: [
        'nil', 'true', 'false',
        ...Object.keys(Language.noType),
        ...Object.keys(Language.types.array),
        ...Object.keys(Language.types.set),
        ...Object.keys(Language.types.string),
        ...Object.keys(Language.types.thing),

    ],

    // typeKeywords: [
    //     'any', 'boolean', 'number', 'object', 'string', 'undefined'
    // ],

    operators: [
        '*', '/', '%', '//',
        '+', '-',
        '&',
        '^',
        '|',
        '<', '>', '==', '!=', '<=', '>=',
        '&&',
        '||',
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%#]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,




    // The main tokenizer for our languages
    tokenizer: {
        root: [
            [/[{}]/, 'delimiter.bracket'],

            // identifiers and keywords
            [/[A-Za-z_][0-9A-Za-z_]*/, {
                cases: {
                    // '@typeKeywords': 'keyword',
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
            // [/[A-Z][\w\$]*/, 'type.identifier'],  // to show class names nicely
            // [/[A-Z][\w\$]*/, 'identifier'],

            // whitespace
            { include: '@whitespace' },

            // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
            [/\/(?=([^\\\/]|\\.)+\/(i?)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],

            // delimiters and operators
            [/[()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'delimiter',
                    '@default': ''
                }
            }],

            // numbers
            [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
            [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
            [/0[xX](@hexdigits)/, 'number.hex'],
            [/0[oO]?(@octaldigits)/, 'number.octal'],
            [/0[bB](@binarydigits)/, 'number.binary'],
            [/(@digits)/, 'number'],

            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],

            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
            [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
        ],

        whitespace: [
            [/[ \t\r\n]+/, ''],
            // [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
            // [/\/\*/, 'comment', '@comment'],
            // [/\/\/.*$/, 'comment'],
        ],

        // comment: [
        //     [/[^\/*]+/, 'comment'],
        //     [/\*\//, 'comment', '@pop'],
        //     [/[\/*]/, 'comment']
        // ],

        // We match regular expression quite precisely
        regexp: [
            [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
            [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
            [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
            [/[()]/, 'regexp.escape.control'],
            [/@regexpctl/, 'regexp.escape.control'],
            [/[^\\\/]/, 'regexp'],
            [/@regexpesc/, 'regexp.escape'],
            [/\\\./, 'regexp.invalid'],
            [/(\/)(i?)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']],
        ],

        regexrange: [
            [/-/, 'regexp.escape.control'],
            [/\^/, 'regexp.invalid'],
            [/@regexpesc/, 'regexp.escape'],
            [/[^\]]/, 'regexp'],
            [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
        ],

        string_double: [
            [/[^\\"]+/, 'string'],
            // [/@escapes/, 'string.escape'],
            // [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ],

        string_single: [
            [/[^\\']+/, 'string'],
            // [/@escapes/, 'string.escape'],
            // [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
        ],
    },
});

monaco.languages.setLanguageConfiguration('mySpecialLanguage', {
    surroundingPairs: [{open:'{', close: '}'}],
    autoClosingPairs: [{open:'{', close: '}'}],
    brackets: [['{','}']],
});

monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
    provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
        const re_str = new RegExp('(?:\'(?:[^\']*)\')+\\.$');

        const suggestions = [];
        if (re_str.test(textUntilPosition)) {
            suggestions.push(...Object.entries(Language.types.string)
                .map(([k, v]) => ({
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: k+'()',
                    documentation: v,
                }))
            );
        } else {
            suggestions.push(...Object.entries(Language.noType)
                .map(([k, v]) => ({
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: k+'()',
                    documentation: v,
                }))
            );
        }
        return { suggestions };
    }
});

const theme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'identifier', foreground: '62948b', fontStyle: 'bold' },
        { token: 'number', foreground: 'd2a800' },
        { token: 'string', foreground: 'e26d14' },
        { token: 'keyword', foreground: '2a80e8'},
    ],
    colors: {
        'editor.foreground': '#0000002e',
        'editor.background': '#0000002e',
        'editorCursor.foreground': '#c6c6c6',
        'editor.lineHighlightBackground': '#141719',
        'editorLineNumber.foreground': '#0000002e',
        'editor.selectionBackground': '#20344b',
        'editor.inactiveSelectionBackground': '#0000002e'
    }
};

class QueryInput extends React.Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        input: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {onChange, input} = this.props;
        const model = monaco.editor.createModel(input, 'mySpecialLanguage');
        monaco.editor.defineTheme('myTheme', theme);
        this._editor = monaco.editor.create(this.ele, {
            // automaticLayout: true, This will make it that the editor installs a timer and checks every 100ms if its container has changed its size... https://github.com/microsoft/monaco-editor/issues/543
            theme: 'myTheme',
            language: 'mySpecialLanguage',
            minimap: {
                enabled: false,
            },
            scrollbar: {
                enabled: false,
            },
            lineNumbers: 'on',
        });
        this._editor.setModel(model);
        onChange(input);
        this._subscription = model.onDidChangeContent(() => {
            let v = model.getValue();
            onChange(v);
        });

        // resize container on window size.
        window.addEventListener('resize', this.handleEditorSize);
    }

    componentWillUnmount() {
        this._editor && this._editor.dispose();
        this._subscription && this._subscription.dispose();

        window.removeEventListener('resize', this.handleEditorSize);
    }

    handleEditorSize = () => {
        this._editor.layout();
    }


    render() {
        return (
            <Paper style={{height: 'calc(100vh - 80vh)', width: '100%'}} ref={(ele) => this.ele = ele} />
        );
    }
}

export default QueryInput;