
const { createProxyServer } = require('http-proxy');
const proxyServer = createProxyServer();
const ctxStatus = {
    "ECONNRESET": 502,
    "ECONNREFUSED": 503,
    "ETIMEOUT": 504,
};
module.exports = async function(target) {
    const options = {
        headers: this.request.headers,
        target,
    };
    this.req.body = this.request.body;
    await new Promise(resolve => {
        proxyServer.web(this.req, this.res, options, (e) => {
            this.status = ctxStatus[(e.code)]
            resolve(0);
        });
    });
}