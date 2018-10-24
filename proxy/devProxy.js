const http = require('http');
const httpProxy = require('http-proxy');
// Reverse proxy for the surrogate server to consume
const reverseProxy = httpProxy.createProxyServer();
const fs = require('fs');
const path = require('path');
// Actual URL of the selfcare server
const targetUrl = 'http://10.50.30.132:8200/';
// Surrogate server local listening port
const proxyPort = '5050';
const rolesPort = '5060';
const rolesFilename = 'roles.json';

// Must set CORS headers to avoid CORB in Chrome (doesn't work in Firefox)
reverseProxy.on('proxyRes', (proxyRes, req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'application/json');
});

// Surrogate server for local dev to access
const surrogate = http.createServer((req, res) => {
  console.log();
  console.log(`-- Request received: ${new Date()}`);
  console.log(req.url);
  console.log(req.method);

  if (req.method === 'OPTIONS') {
    /**
     * Response to preflight request, for header details please refer to:
     * https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
     * The following three headers are compulsory.
     */
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end();
  } else {
    // You can manually set request method to what you need here
    // req.method = 'POST';
    // Compulsory headers required by selfcare server
    req.headers = {
      'ocs-user-id': 'mocca_admin',
      'ocs-client-id': 'mocca',
      'Content-Type': 'application/json',
    };

    // Using 'web' mode to relay the requests
    reverseProxy.web(req, res, { target: targetUrl });
  }
});

surrogate.listen(proxyPort);

console.log(`-- Selfcare proxy is listening on port ${proxyPort}`);
console.log();

const rolesJson = http.createServer((req, res) => {
  // Read the roles from a local JSON file
  fs.readFile(path.join(__dirname, rolesFilename), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      res.setHeader('Content-type', 'application/json' || 'text/plain');
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
      res.setHeader('Access-Control-Allow-Headers', 'application/json');
      res.end(data);
    }
  });
});

rolesJson.listen(rolesPort);

console.log(`-- Rights proxy is listening on port ${rolesPort}`);
console.log();
