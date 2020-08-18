/*eslint-disable */
var path = require('path');

var TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

var PATHS = {
  entryPoint: path.resolve(__dirname, 'src/index.ts'),
  bundles: path.resolve(__dirname, 'dist/bundles'),
};

console.log('Prod config');

var config = {
  // These are the entry point of our library. We tell webpack to use
  // the name we assign later, when creating the bundle. We also use
  // the name to filter the second entry point for applying code
  // minification via UglifyJS
  entry: {
    'clean-web-ui-property-grid': [PATHS.entryPoint],
    'clean-web-ui-property-grid.min': [PATHS.entryPoint],
  },
  // The output defines how and where we want the bundles. The special
  // value `[name]` in `filename` tell Webpack to use the name we defined above.
  // We target a UMD and name it MyLib. When including the bundle in the browser
  // it will be accessible at `window.MyLib`
  output: {
    path: PATHS.bundles,
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'CleanWebUIPropertyGrid',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  // Add resolve for `tsx` and `ts` files, otherwise Webpack would
  // only look for common JavaScript file extension (.js)
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // Activate source maps for the bundles in order to preserve the original
  // source when the user debugs the application
  devtool: 'source-map',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'README.md'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'package.json'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'LICENSE'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, '.npmignore'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
  ],
  module: {
    // Webpack doesn't understand TypeScript files and a loader is needed.
    // `node_modules` folder is excluded in order to prevent problems with
    // the library dependencies, as well as `__tests__` folders that
    // contain the tests for the library
    rules: [
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        query: {
          // we don't want any declaration file in the bundles
          // folder since it wouldn't be of any use ans the source
          // map already include everything for debugging
          declaration: false,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new TerserPlugin({
        parallel: true,
        include: /\.min\.js$/,
        terserOptions: {
          ecma: 6,
        },
      }),
    ],
  },
  stats: {
    colors: {
      green: '\u001b[32m',
    },
  },
};

module.exports = config;
