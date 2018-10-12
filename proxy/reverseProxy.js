let http = require('http'),
    httpProxy = require('http-proxy');

// Actual URL of the selfcare server
let targetUrl = 'http://10.50.30.121:8200/';

// Reverse proxy for the surrogate server to consume
let reverseProxy = httpProxy.createProxyServer({});
 
// Surrogate server for local dev to access instead of
// the actual selfcare server
let surrogate = http.createServer(function(req, res) {
  console.log();
  console.log("-- Request received: " + new Date());
  console.log(req.url);

  /**
   * Must set method to GET. Since this proxy relays requests
   * from the browser, the incoming method is still OPTIONS 
   * which will in turn be sent to the proxy and causing 500
   * errors.
   */
  req.method = 'GET';
  // Headers are not send through, so they must be set
  req.headers = {
    'ocs-client-id': 'mocca',
    'ocs-user-id': 'mocca_admin'
  }

  // using 'web' mode to relay the requests
  reverseProxy.web(req, res, { target: targetUrl });
});
 
surrogate.listen(5050);

console.log("-- Listening on port 5050");