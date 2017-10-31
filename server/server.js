var WebSocketServer = new require('ws');
var dgram = require('dgram');
var UDP_PORT = 5000;
var WEBSOCET_PORT = 8081
var clients = {};
var webclient = [];
var sdevice = [];
var newDevice 

// Определение собственного IP-----------------------
var os = require('os');
var ifaces = os.networkInterfaces();

var IP_ADDRESS = ifaces.wlan0[0].address;
//---------------------------------------------------

// UDP сервер----------------------------------------
var srv = dgram.createSocket('udp4');
srv.on('listening', function(){
    srv.setBroadcast(true);
});

srv.on('message', function (message, rinfo) {
    console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message);
        var setParam = {
			magic:"&SETUP",
			ip:IP_ADDRESS,
			port:WEBSOCET_PORT
		}
		var jStr = JSON.stringify(setParam);
		msg = new Buffer(jStr);
        srv.send(msg, 0, msg.length, rinfo.port, rinfo.address, function (err, bytes) {
        console.log("sent ACK.");
        });
});

srv.bind(UDP_PORT);
//--------------------------------------------------

// WebSocket-сервер на порту WEBSOCET_PORT-------------------
var webSocketServer = new WebSocketServer.Server({
  port: WEBSOCET_PORT
});
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);
  ws.send("&INIT ");

 
  ws.on('message', function(message) {
						console.log(message);
						for (key in clients) {clients[key].send(message)}
					});

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });
});
