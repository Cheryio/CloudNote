const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
})
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.245.150.92:8081',  // 后台接口地址
        secure: true,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {	// 重写路径
          '^/api': ''
        }
      }
    }
  }
}
