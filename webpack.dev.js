var webpack = require("webpack");

module.exports = {
  entry: [
    "webpack-dev-server/client?http://localhost:3000",
    "webpack/hot/only-dev-server",
    "./js/app.jsx",
    ],
  output: {
    filename: "bundle.js",
    publicPath: "build/"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
        loaders: [
            {
                loaders:['react-hot', 'babel-loader'],
                test: /.jsx?$/,
                exclude: /node_modules/,
            }
        ],
        noParse: /node_modules\/quill\/dist/
    },
  plugins: [  new webpack.HotModuleReplacementPlugin(), ]
};

