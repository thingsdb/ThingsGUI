import React from 'react';
import PropTypes, { element } from 'prop-types';

import Language from './Language.js';
import * as monaco from 'monaco-editor';

monaco.languages.register({ id: 'mySpecialLanguage' });

monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
    defaultToken: 'invalid',
    // tokenPostfix: '',

    keywords: [
        'nil', 'true', 'false',
        ...Object.keys(Language.noType),
        ...Object.keys(Language.node),
        ...Object.keys(Language.thingsdb),
        ...Object.keys(Language.procedures),
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
            // [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
            // [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
        ],
        comment: [
            [/[^\/*]+/, 'comment' ],
            [/\/\*/,    'comment', '@push' ],    // nested comment
            ["\\*/",    'comment', '@pop'  ],
            [/[\/*]/,   'comment' ]
        ],

        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/,       'comment', '@comment' ],
            [/\/\/.*$/,    'comment'],
        ],

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
            suggestions.push(...Object.entries(Language.node)
                .map(([k, v]) => ({
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: k+'()',
                    documentation: v,
                }))
            );
            suggestions.push(...Object.entries(Language.thingsdb)
                .map(([k, v]) => ({
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: k+'()',
                    documentation: v,
                }))
            );
            suggestions.push(...Object.entries(Language.procedures)
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
        { token: 'identifier', foreground: '4c7fbb', fontStyle: 'bold' },
        { token: 'number', foreground: 'd2a800' },
        { token: 'string', foreground: 'e26d14' },
        { token: 'keyword', foreground: 'b064bd' },
        { token: 'comment', foreground: '608b4e' },
        { token: 'whitespace', foreground: '608b4e' },
    ],
    colors: {
        'editor.foreground': '#0000002e',
        'editor.background': '#0000002e',
        'editorCursor.foreground': '#c6c6c6',
        'editor.lineHighlightBackground': '#141719',
        'editorLineNumber.foreground': '#c6c6c6',
        'editor.selectionBackground': '#20344b',
        'editor.inactiveSelectionBackground': '#c6c6c6'
    }
};

class QueryInput extends React.Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        input: PropTypes.string.isRequired,
        height: PropTypes.number.isRequired,
    }

    constructor(props) {
        super(props);
        this.ele = React.createRef();
    }

    componentDidMount() {
        const {onChange, input} = this.props;
        const model = monaco.editor.createModel(input, 'mySpecialLanguage');
        monaco.editor.defineTheme('myTheme', theme);
        this._editor = monaco.editor.create(this.ele, {
            automaticLayout: true, //This will make it that the editor installs a timer and checks every 100ms if its container has changed its size... https://github.com/microsoft/monaco-editor/issues/543
            theme: 'myTheme',
            language: 'mySpecialLanguage',
            minimap: {
                enabled: false,
            },
            scrollbar: {
                enabled: false,
            },
            lineNumbers: 'on',
            scrollBeyondLastLine: false
        });
        this._editor.setModel(model);
        // onChange(input);
        this._subscription = model.onDidChangeContent(() => {
            let v = model.getValue();
            onChange(v);
        });

        // resize container on window size.
        window.addEventListener('resize', this.handleEditorSize);

        this._editor.addCommand([monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter], function() {
            return; // Prevent ctrl+enter from processing the enter key stroke. The idea is that ctrl+enter submits the editor's input.
        });
        this._editor.layout();
    }

    componentDidUpdate(prevProps) {
        const { input } = this.props;
        const model = this._editor.getModel();
        if (input && input != prevProps.input && input != model.getValue()) {
            model.pushEditOperations(
                [],
                [
                    {
                        range: model.getFullModelRange(),
                        text: input,
                    },
                ]
            );
        }
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
        const {height} = this.props;
        return (
            <div style={{height: height, width: '100%'}} ref={(ele) => this.ele = ele} />
        );
    }
}

export default QueryInput;