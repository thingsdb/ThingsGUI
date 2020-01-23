/* global require, __dirname, process, module */

const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const VERSION = require(path.resolve(__dirname, './package.json')).version;
const BUILD_DIR = path.resolve(__dirname, '../static/js');
const APP_DIR = path.resolve(__dirname, '');

const config = {
    entry: APP_DIR + '/Components/index.js',
    output: {
        path: BUILD_DIR,
        publicPath: '/js/',
        filename: process.env.NODE_ENV === 'production' ? `[name]-bundle-${VERSION}.min.js` : `[name]-bundle-${VERSION}.js`,
    },
    module: {
        rules: [{
            test: /\.js?/,
            loader: 'babel-loader',
            query: {
                cacheDirectory: true
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new MonacoWebpackPlugin(),
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
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        maxEntrypointSize: 1600000,
        maxAssetSize: 700000
    }
};

module.exports = config;