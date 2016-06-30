/**
 * Created by JackieWu on 16/4/20.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const exec = require('child_process').exec;

const packageJson = JSON.parse(fs.readFileSync('package.json'));

// npm 指令
const ENV = process.env.npm_lifecycle_event;

const entryFile = {};

const copyFile = ['route-tpl', 'images'];

const recursive = (file, src)=> {
    fs.readdirSync(path.join(file, src)).forEach((item)=> {
        if (item !== 'lib') {
            if (!!~item.indexOf('.js')) {
                let split = path.join(file, src).split(packageJson.name);
                entryFile['.' + split[1].split('src')[1] + '/' + item.split('.js')[0]] = '.' + split[1] + '/' + item;
            } else {
                recursive(path.join(file, src), item);
            }
        }
    });
};


recursive(path.join(__dirname, 'src'), 'js');

module.exports = (()=> {
    const config = {};
    config.entry = entryFile;
    config.plugins = [];

    config.output = {
        filename: '[name].js'            //每个页面对应的主js的生成配置
        //chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
    };
    if (ENV === 'build') {
        exec('rm -rf ./build');
        config.output.path = path.join(__dirname, 'build')
    } else {
        config.output.path = path.join(__dirname, 'build')
    }

    copyFile.forEach((item)=> {
        config.plugins.push(
            new CopyWebpackPlugin([
                {
                    from: './src/' + item + '/',
                    to: './' + item
                }
            ])
        );
    });

    config.module = {
        loaders: [
            {
                // HTML LOADER
                // Reference: https://github.com/webpack/raw-loader
                // Allow loading html through js
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: [/\.js$/],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    compact: true
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'path-file-loader',
                query: {
                    name: '[name].[hash].[ext]',
                    publicPath: './images/',
                    cssPath: '../images/'
                }
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
            }
        ]
    };
    config.postcss = [
        autoprefixer({
                browsers: ['last 2 versions']
            }
        )
    ];

    config.plugins.push(
        new ExtractTextPlugin('css/main.css'),
        // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
        // Dedupe modules in the output
        new webpack.optimize.DedupePlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html',
            inject: 'body',
            chunks: ['./js/main']
        })
    );
    config.devServer = {
        contentBase: './',
        stats: 'minimal',
        port: 4000
    };
    return config

})();
