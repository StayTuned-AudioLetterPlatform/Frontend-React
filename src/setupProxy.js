const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/oauth2', {
            target: 'https://stay-tuned.shop',
            changeOrigin: true,
        })
    );
}
