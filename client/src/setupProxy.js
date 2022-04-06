const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/users",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
  app.use(
    "/ws-stomp",
    createProxyMiddleware({ target: "http://localhost:5000", ws: true })
  );
};