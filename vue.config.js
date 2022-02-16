module.exports = {
  css: {
      loaderOptions: {
          sass: {
              additionalData: `
                @import "@/styles/_config.scss";
                @import "@/styles/_utilities.scss";
              `
          }
      }
  }
}; 