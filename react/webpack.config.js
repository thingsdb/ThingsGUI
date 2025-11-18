/* global require, __dirname, process, module */

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const VERSION = require(path.resolve(__dirname, './package.json')).version;
const BUILD_DIR = path.resolve(__dirname, './static/js');
const APP_DIR = path.resolve(__dirname, '');


const config = {
    mode: process.env.NODE_ENV === 'production' ? 'production': 'development',
    entry: APP_DIR + '/src/index.js',
    output: {
        path: BUILD_DIR,
        publicPath: '/js/',
        filename: process.env.NODE_ENV === 'production' ? `[name]-bundle-${VERSION}.min.js` : `[name]-bundle-${VERSION}.js`,
    },
    module: {
        rules: [{
            test: /\.js?/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'] // keep at version "css-loader": "5.2.7", because of: https://github.com/microsoft/monaco-editor/issues/2742
        }, {
            test: /\.ttf$/,
            loader: 'file-loader',
            options: {
                name: 'monaco-font.ttf',
                // Failed to decode downloaded font: ...
                // OTS parsing error: invalid version tag
                // Adding following solved warning above
                outputPath: '../fonts/',
                publicPath: 'fonts',
            },
        }]
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: ['javascript']
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new BundleAnalyzerPlugin({
            /* Usage:
             *      NODE_ENV='analyze' ./node_modules/.bin/webpack -p
             *      or
             *      npm run analyze
             */
            'analyzerMode': process.env.NODE_ENV === 'analyze' ? 'static' : 'disabled'
        }),
        // To strip all locales except “en”
        new MomentLocalesPlugin(),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        minimize: process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'analyze',
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ],
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        maxEntrypointSize: 10485760,
        maxAssetSize: 10485760
    },
    resolve: {
        fallback: {
            'path': require.resolve('path-browserify'),
        }
    }
};

module.exports = config;