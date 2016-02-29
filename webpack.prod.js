var webpack = require("webpack");

module.exports = {
  entry: "./js/app.jsx",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js",
    publicPath: "/"
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
            }
        ],
        noParse: /node_modules\/quill\/dist/
    },
  plugins: [
    new webpack.DefinePlugin({'process.env':{'NODE_ENV': JSON.stringify('production')}})]
};

