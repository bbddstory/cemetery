// This is a standalone proxy

var http = require('http'),
    httpProxy = require('http-proxy');
//
// Create your proxy server and set the target in the options.
//
httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(8000); // See (†)
 
//
// Create your target server
//
http.createServer(function (req, res) {
  console.log("-- Request received: " + new Date());
  console.log(req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);
 
console.log("-- Listening on port 9000...")