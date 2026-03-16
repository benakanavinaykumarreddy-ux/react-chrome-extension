const path = require("path");

module.exports = {
  entry: "./src/index.jsx",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|less|css)$/,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js", ".js"],
  },
  output: {
    filename: "content.js",
    path: path.resolve(__dirname, "..", "extension"),
  },
};
