var webpack = require("webpack");

module.exports = {
  entry: "./app.jsx",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js",
    publicPath: "build/"
  },
  module: {
        loaders: [
            {
                loader:'babel-loader',
                test: /.jsx?$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    },
  plugins: []
};

