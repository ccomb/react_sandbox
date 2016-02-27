var webpack = require("webpack");
//var path = require("path");

module.exports = {
  entry: [
    "webpack-dev-server/client?http://0.0.0.0:3000",
    "webpack/hot/only-dev-server",
    "./js/app.jsx",
//    "./material-ui/src/index.js",
    ],
  output: {
    filename: "bundle.js",
    publicPath: "/"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
//    alias: {
//      'material-ui/lib': path.resolve(__dirname, 'material-ui/src'),
//      'material-ui': path.resolve(__dirname, 'material-ui/src'),
//    }
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

