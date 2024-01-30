const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/sdk.ts', // your main TypeScript file
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'sdk.js', // output bundle file name
    path: path.resolve(__dirname, 'dist'), // output path
  },
};
