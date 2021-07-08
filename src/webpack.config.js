/* global require, __dirname, process, module */

const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const VERSION = require(path.resolve(__dirname, './package.json')).version;
const BUILD_DIR = path.resolve(__dirname, '../static/js');
const APP_DIR = path.resolve(__dirname, '');

// call dotenv and it will return an Object with a parsed key
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

const config = {
    mode: process.env.NODE_ENV === 'production' ? 'production': 'development',
    entry: APP_DIR + '/Components/index.js',
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
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.ttf$/,
            loader:'file-loader',
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
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
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
        new webpack.DefinePlugin({process: envKeys}),
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
        maxEntrypointSize: 1600000,
        maxAssetSize: 700000
    },
    resolve: {
        fallback: {
            'path': require.resolve('path-browserify')
        }
    }
};

module.exports = config;