const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
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
