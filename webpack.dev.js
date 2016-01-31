
module.exports = {
  entry: "./app",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js",
    publicPath: "build/"
  },
  module: {
        loaders: [
            {
                loader:'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};

