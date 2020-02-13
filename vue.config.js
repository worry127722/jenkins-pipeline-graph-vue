const path = require('path');

function resolveSrc(_path) {
  return path.join(__dirname, _path);
}
// vue.config.js
module.exports = {
  lintOnSave: true,
  configureWebpack: {
    // Set up all the aliases we use in our app.
    resolve: {
      alias: {
        assets: resolveSrc('src/assets')
      }
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  // 本地header配置
  // devServer: {
  //   disableHostCheck: true
  // }

  // 本地开发转发后端服务 解决跨域问题
  // devServer: {
  //   proxy: {
  //     '/api/pipeline/confirm': {
  //       // target: 'http://127.0.0.1:7001',
  //       // target: 'http://172.17.28.109:6406',   // yujin
  //       // target: 'http://172.17.29.43:6400',   //jiajia
  //       target: 'https://keep.corp.kuaishou.com',
  //       // target: 'https://changxiao-test.corp.kuaishou.com',
  //       changeOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         '^/': '/'
  //       }
  //     },
  //     '/api/pipeline': {
  //       target: 'http://127.0.0.1:6400',
  //       // target: 'http://172.17.28.109:6406',   // yujin
  //       // target: 'http://172.17.29.43:6400',   //jiajia
  //       // target: 'https://keep.corp.kuaishou.com',
  //       // target: 'https://changxiao-test.corp.kuaishou.com',
  //       changeOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         '^/': '/'
  //       }
  //     },
  //     '/api/common': {
  //       target: 'http://127.0.0.1:6100',
  //       changeOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         '^/': '/'
  //       }
  //     },
  //     '/api/exception_analysis': {
  //       target: 'https://keep.corp.kuaishou.com',
  //       changeOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         '^/': '/'
  //       }
  //     },
  //   },
  //   https: true
  // }

};
