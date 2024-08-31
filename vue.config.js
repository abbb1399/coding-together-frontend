const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/main.scss";`,
      },
    },
  },
};
