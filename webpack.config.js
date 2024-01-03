const path = require('path');

// Use environment variable to set mode. Default to 'production' if not set.
const mode = process.env.NODE_ENV || 'production';

module.exports = {
  mode: mode,
  entry: './src/sdk.ts', // your main TypeScript file
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    libraryTarget: 'module',
    filename: 'sdk.js', // output bundle file name
    path: path.resolve(__dirname, 'dist'), // output path
  },
};
