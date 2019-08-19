import * as monaco from 'monaco-editor';
import Language from './Language.js';

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
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
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
            [/^[A-Za-z_][0-9A-Za-z_]*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],

            // whitespace
            [/[ \t\r\n]+/, ''],
            [/\/\*/, 'comment', '@comment'],

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

        comment: [
            [/[^\/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
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
    brackets: [['{','}']]
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
            // suggestions.push({
            //     label: 'test',
            //     kind: monaco.languages.CompletionItemKind.Keyword,
            //     insertText: 'test(${1:pattern})',
            //     insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            //     documentation: 'Test if a string matches a given regular expression and return true or false.'
            // });
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

export default (node) => {
    // console.log(monaco.languages.getLanguages())
    const value = [
        '"a""a";',
        "'a''a';",
        '"a\"a";',
        "'a\'a';",
    ].join('\n');
    return monaco.editor.create(node, {
        theme: 'vs-dark',
        value,
        language: 'mySpecialLanguage',
        minimap: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },
        lineNumbers: 'off',
    });
};