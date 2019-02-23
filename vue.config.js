const path = require('path')

module.exports = {
  lintOnSave: false,

  chainWebpack: config => {
    config.watchOptions = {
      aggregateTimeout: 5000,
      ignored: [/node_modules/],
    };

    if (process.env.NODE_ENV !== 'production') {
      config.devtool('eval');
    }

    if (process.env.NODE_ENV === 'test') {
      config.module
        .rule('istanbul')
          .test(/\.(js|ts|vue)$/)
          .enforce('post')
          .include
            .add(path.resolve(__dirname, '/src'))
            .end()
          .use('istanbul-instrumenter-loader')
            .loader('istanbul-instrumenter-loader')
            .options({ esModules: true })
            .end();
    }
  }
}
