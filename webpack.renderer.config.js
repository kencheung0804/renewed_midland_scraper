module.exports = {
  // Put your normal webpack config below here
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: { "react-dom": "@hot-loader/react-dom" },
    fallback: { "path": require.resolve("path-browserify") }
  },
  module: {
    rules: require("./webpack.rules"),
  },
};
