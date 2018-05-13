var path = require('path')

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/client')
      }
    }
  }
}
