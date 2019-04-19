"use strict";

const path = require('path');
const webpack = require('webpack');
const CopyWebpack = require('copy-webpack-plugin');
const HtmlWebpack = require('html-webpack-plugin');
const UglifyJS = require('uglifyjs-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = {
  entry: `./src/index.js`,
  output: {
    path: path.resolve('build'),
    filename: 'index.min.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "./fonts/"
          }
        }
      },
      {
        test: /\.less$/,
        use: ExtractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: isProduction,
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: isProduction,
              }
            },
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: isProduction
              }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.less'],
    alias: {
      '@core': path.join(__dirname, 'src/core/index')
    },
  },
  plugins:[
    new webpack.ProvidePlugin({
      'THREE': 'three'
    }),
    new webpack.ProvidePlugin({
      'CANNON': 'cannon'
    }),
    new CopyWebpack([
      { from: `src/playground/models`, to: 'src/playground/models' },
      { from: `src/playground/textures`, to: 'src/playground/textures' },
    ]),
    new HtmlWebpack({
      template: `./src/index.html`,
      filename: 'index.html',
      inject: 'body',
    }),
    new ExtractText('styles.min.css')
  ],
};

if (isProduction) {
  webpackConfig.plugins.push(
    new UglifyJS({
      sourceMap: true,
      extractComments: true,
      uglifyOptions: {
        mangle: {
          keep_fnames: true
        }
      },
    })
  )
}

module.exports = webpackConfig;