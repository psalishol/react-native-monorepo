const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);

// const {presets} = require(`${appDirectory}/babel.config.js`);
const {presets} = require('./babel.config.js');

const compileNodeModules = [
  // Add every react-native package that needs compiling
].map(moduleName =>
  path.resolve(appDirectory, `../node_modules/${moduleName}`),
);

const babelLoaderConfiguration = {
  test: /\.js$|tsx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.js'), // Entry to your application
    path.resolve(__dirname, '../App.tsx'), // Change this to your main App file
    path.resolve(__dirname, '../src'),
    ...compileNodeModules,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets,
      plugins: ['react-native-web', 'react-native-reanimated/plugin'],
    },
  },
};

const iconLoader = {
  test: /\.ttf$/,
  loader: 'url-loader',
  include: [
    path.resolve(__dirname, '../node_modules/react-native-vector-icons'),
    path.resolve(__dirname, '../web/public/assets/fonts/poppins'),
    // path.resolve(__dirname, './public/assets/fonts/poppins'),
  ],
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

module.exports = {
  entry: {
    app: path.join(__dirname, 'index.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'build'),
    publicPath: '/',
    filename: 'web.bundle.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
      'lottie-react-native': 'react-native-web-lottie',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      iconLoader,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({JEST_WORKER_ID: null}),
    new webpack.DefinePlugin({process: {env: {}}}),
    new webpack.DefinePlugin({
      // See: https://github.com/necolas/react-native-web/issues/349
      __DEV__: JSON.stringify(true),
    }),
  ],
};
