var webpack = require("webpack");

module.exports = {
  entry: "./js/app.jsx",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js",
    publicPath: "build/"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
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
  plugins: [
    new webpack.DefinePlugin({'process.env':{'NODE_ENV': JSON.stringify('production')}})]
};

