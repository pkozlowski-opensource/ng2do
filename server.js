var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

var port = 9000, app;

app = connect().use(serveStatic(__dirname));  // serve everything that is static
http.createServer(app).listen(port, function () {
});