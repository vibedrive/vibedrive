var path = require('path')

module.exports = {
  lintOnSave: true,
  baseUrl: path.join(__dirname, 'dist'),
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/client')
      }
    }
  }
}
