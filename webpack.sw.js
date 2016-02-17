module.exports = {
  entry: [
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
                loaders:['babel-loader'],
                test: /.jsx?$/,
                exclude: /node_modules/,
            }
        ],
        noParse: /node_modules\/quill\/dist/
    },
};

