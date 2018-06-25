var path = require('path')

module.exports = {
  lintOnSave: true,
  // baseUrl: '.',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/client')
      }
    }
  }
}
