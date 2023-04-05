const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/test',
        createProxyMiddleware({
            target: 'http://192.168.0.5:8080',
            changeOrigin: true,
            pathRewrite: {
                '^/test': ''
            }
        })
    );
}