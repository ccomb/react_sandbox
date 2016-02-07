var webpack = require("webpack");

module.exports = {
  entry: [
    "webpack-dev-server/client?http://localhost:3000",
    "webpack/hot/only-dev-server",
    "./app.jsx",
    ],
  output: {
    filename: "bundle.js",
    publicPath: "build/"
  },
  module: {
        loaders: [
            {
                loaders:['react-hot', 'babel-loader'],
                test: /.jsx?$/,
                exclude: /node_modules/,
            }
        ]
    },
  plugins: [  new webpack.HotModuleReplacementPlugin(), ]
};

