var http = require('http');
var IpUtil = require('./iputil');
var ipUtil = new IpUtil('./auth.txt', 'utf8');

function getClientIP(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

var server = http.createServer(function (req, res) {
    if (req.url != '/favicoun.ico') {
        var client_ip = getClientIP(req);
        console.log("Client IP: " + client_ip);
        var ip = ipUtil.getIpInfo(client_ip);
        if (ip != null) {
            result = ip.address;
            res.writeHead(200, {'Content-Type': 'application/json'});
            data = {"auth_state": "true", "auth_address:": result, "client_ip": client_ip};
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            data = {"auth_state": "false", "auth_address": "invalid address", "client_ip": client_ip};
            res.end(JSON.stringify(data));
        }
    }
});

server.listen(4000, '0.0.0.0');
