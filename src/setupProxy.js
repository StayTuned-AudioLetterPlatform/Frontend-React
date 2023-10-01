const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/oauth2', {
            target: 'http://ec2-52-79-213-56.ap-northeast-2.compute.amazonaws.com:8080',
            changeOrigin: true,
        })
    );
}
