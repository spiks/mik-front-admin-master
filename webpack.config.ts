import webpack, {Configuration} from 'webpack'
import * as path from 'path'

import fs from 'fs'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {CleanWebpackPlugin} from 'clean-webpack-plugin'

const config = require('./config.js')

const version = fs.readFileSync('./VERSION')

const env = !!config.env && config.env || 'development'
const cacheBoosting = env !== 'development'
const assetPath = '/build/'

const removeNullLoaders = (loader: object | string | null) => !!loader

const postCssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: function () {
            return [
                require('postcss-short'),
                require('postcss-preset-env')
            ]
        },
        sourceMap: false
    }
}

const threadLoader = {
    loader: 'thread-loader',
    // loaders with equal options will share worker pools
    options: {
        // number of jobs a worker processes in parallel
        // defaults to 20
        workerParallelJobs: 30,

        // Allow to respawn a dead worker pool
        // respawning slows down the entire compilation
        // and should be set to false for development
        poolRespawn: env !== 'development'
    }
}

const cacheLoader = env === 'development' && {
    loader: 'cache-loader',
    options: {
        cacheDirectory: path.resolve(
            __dirname,
            'node_modules/.cache/cache-loader'
        )
    }
} || null

const tsLoaders: any = [cacheLoader, threadLoader, 'babel-loader', {
    loader: 'ts-loader',
    options: {
        happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
    }
}].filter(removeNullLoaders)

const sassLoaders: any = [
    env === 'development' && 'style-loader' || MiniCssExtractPlugin.loader,
    cacheLoader,
    {
        loader: 'css-loader',
        options: {
            importLoaders: 2,
            modules: {
                localIdentName: '[name]--[local]--[hash:base64:8]'
            }
        }
    },
    postCssLoader,
    {
        loader: 'sass-loader',
        options: {
            sourceMap: false
        }
    }
].filter(removeNullLoaders)

const configuration: Configuration = {
    node: {
        fs: 'empty'
    },
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, 'public'),
        historyApiFallback: true,
        compress: true,
        port: 9001,
        host: 'localhost',
        watchContentBase: true
    },
    mode: env,
    entry: ['@babel/polyfill', 'react-hot-loader/patch', './src/index.tsx'],
    output: {
        path: __dirname + '/public/build/',
        publicPath: assetPath,
        chunkFilename: cacheBoosting ? '[name].[chunkhash].js' : '[name].bundle.js',
        filename: cacheBoosting ? 'bundle-[hash:8].js' : 'bundle.js',
        pathinfo: false
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.svg', '.css'],
        modules: ['node_modules', 'src'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: __dirname + '/public/index.html',
            template: __dirname + '/public/index-template.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                SERVICE_URL: JSON.stringify(config.service_url),
                NODE_ENV: JSON.stringify(env),
                SENTRY_ENV: JSON.stringify(config.sentry_env),
                APP_VERSION: JSON.stringify(version.toString())
            }
        }),
        new MiniCssExtractPlugin({
            filename: cacheBoosting ? 'styles-[hash:8].css' : 'styles.css'
        })
    ],
    optimization: {
        runtimeChunk: true,
        minimizer: [
            new TerserPlugin({
                cache: env === 'development',
                parallel: true
            })
        ],
        splitChunks: env === 'development' && false || {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: tsLoaders
            }, {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    postCssLoader
                ]
            }, {
                test: /\.scss$/,
                use: sassLoaders
            }, {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash].[ext]'
                    }
                }
            }, {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[hash].[ext]'
                }
            }
        ]
    }
}

export default configuration
