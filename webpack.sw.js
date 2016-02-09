module.exports = {
  entry: [
    "./js/app.jsx",
    ],
  output: {
    filename: "bundle.js",
    publicPath: "build/"
  },
  module: {
        loaders: [
            {
                loaders:['babel-loader'],
                test: /.jsx?$/,
                exclude: /node_modules/,
            }
        ]
    },
};

