/* global require, __dirname, process, module */

const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const VERSION = require(path.resolve(__dirname, './package.json')).version;
const BUILD_DIR = path.resolve(__dirname, '../static/js');
const APP_DIR = path.resolve(__dirname, '');

const config = {
    entry: APP_DIR + '/Components/index.js',
    output: {
        path: BUILD_DIR,
        publicPath: '/static/js/',
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
        }]
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new BundleAnalyzerPlugin({
            /* Usage:
             *      NODE_ENV='analyze' ./node_modules/.bin/webpack -p
             *      or
             *      npm run analyze
             */
            'analyzerMode': process.env.NODE_ENV === 'analyze' ? 'static' : 'disabled'
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                }
            })
        ],
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