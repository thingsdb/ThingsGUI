/* eslint-env node */

const globals = require('globals');
const js = require('@eslint/js');
const parser = require('@babel/eslint-parser');
const react = require('eslint-plugin-react');
const configsReact = require('eslint-plugin-react/configs/all.js');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
    js.configs.recommended,
    configsReact,
    {
        files: [
            '**/*.{js,jsx,ts,tsx}'
        ],
        ignores: [
            'node_modules/*',
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es6,
            },
            parserOptions: {
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    presets: [
                        '@babel/preset-react'
                    ]
                },
            },
            parser,
        },
        plugins: {
            'react': react,
            'react-hooks': reactHooks,
        },
        settings: {
            react: {
                version: '19.2.0'
            }
        },
        rules: {
            'indent': [
                'error',
                4
            ],
            'linebreak-style': [
                'error',
                'unix'
            ],
            'quotes': [
                'error',
                'single'
            ],
            'semi': [
                'error',
                'always'
            ],
            'no-prototype-builtins': 'off',
            'react/display-name': 'off',
            'react/function-component-definition': 'off',
            'react/forbid-component-props': 'off',
            'react/jsx-newline': 'off',
            'react/forbid-foreign-prop-types': 'off',
            'react/forbid-prop-types': ['error', {'forbid': ['any', 'array']}],
            'react/jsx-curly-brace-presence': 'off',
            'react/jsx-curly-newline': 'off',
            'react/jsx-filename-extension': ['warn', { 'extensions': ['.js', '.jsx'] }],
            'react/jsx-fragments': 'off',
            'react/jsx-handler-names': 'off',
            'react/jsx-max-depth': 'off',  // Tempate docs
            'react/jsx-max-props-per-line': ['error', {'when': 'multiline'}],
            'react/jsx-no-bind': ['error', { 'allowArrowFunctions': true }],
            'react/jsx-sort-default-props': 'off',
            'react/jsx-sort-props': 'off',
            'react/jsx-uses-vars': 'error',
            'react/no-array-index-key': 'off',
            'react/no-set-state': 'off',
            'react/prefer-stateless-function': 'off',
            'react/require-optimization': 'off',
            'react/sort-comp': 'off',
            'react/sort-prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
            'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
            'react/jsx-no-leaked-render': 'off',

            'react/require-default-props': 'off',  // TODO
            'react/no-object-type-as-default-prop': 'off',  // TODO

            // 'no-unused-vars': ['error', {
            //     'args': 'all',  // TODO find out if we want all errors or other setting for this
            //     'argsIgnorePattern': '^_',  // typed function signatures should have a prefix
            // }]
        }
    },
];