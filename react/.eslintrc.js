/* eslint-env node */

module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': ['eslint:recommended', 'plugin:react/all'],
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
            'jsx': true
        },
        'sourceType': 'module',
        'requireConfigFile': false,
        'babelOptions': {
            'presets': ['@babel/preset-react']
        },
    },
    'parser': '@babel/eslint-parser',
    'plugins': [
        'react',
        'react-hooks'
    ],
    'settings': {
        'react': {
            'version': 'detect'
        }
    },
    'rules': {
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
        'no-prototype-builtins': [0],
        'react/display-name': [0],
        'react/function-component-definition': [0],
        'react/forbid-component-props': [0],
        'react/jsx-newline': [0],
        'react/forbid-foreign-prop-types': [0],
        'react/forbid-prop-types': [2, {'forbid': ['any', 'array']}],
        'react/jsx-curly-brace-presence': [0],
        'react/jsx-curly-newline': [0],
        'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
        'react/jsx-fragments': [0],
        'react/jsx-handler-names': [0],
        'react/jsx-max-depth': [0],  // Tempate docs
        'react/jsx-max-props-per-line': [2, {'when': 'multiline'}],
        'react/jsx-no-bind': [2, { 'allowArrowFunctions': true }],
        'react/jsx-sort-default-props': [0],
        'react/jsx-sort-props': [0],
        'react/jsx-uses-vars': [2],
        'react/no-array-index-key': [0],
        'react/no-set-state': [0],
        'react/prefer-stateless-function': [0],
        'react/require-optimization': [0],
        'react/sort-comp': [0],
        'react/sort-prop-types': [0],
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
        'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
        'react/jsx-no-leaked-render': [0],
    }
};
