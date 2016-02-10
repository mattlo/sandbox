const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const common = {
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'app',
      template: 'node_modules/html-webpack-template/index.html',
      appMountId: 'myAppId'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      },
      {
        // Test expects a RegExp! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app
      }
    ]
  }
};

if (TARGET === 'build' || !TARGET) {
  module.exports = merge(common, {});
}

if (TARGET === 'start') {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT
    }, plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}