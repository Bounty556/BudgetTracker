const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  entry: {
    app: './index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      name: 'Budget Tracker',
      short_name: 'Budget Tracker',
      description: 'An application that allows you to keep track of expenses and deposits.',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      start_url: '/',
      icons: [{
        src: path.resolve('icons/icon-192x192.png'),
        sizes: [96, 192, 384],
        destination: 'icons'
      },
      {
        src: path.resolve('icons/icon-512x512.png'),
        sizes: [128, 256, 512],
        destination: 'icons'
      }],
    })
  ]
};

module.exports = config;
