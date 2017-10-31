var PORT = 5000;
var BROADCAST_ADDR = "10.33.0.255";
var dgram = require('dgram');
var srv = dgram.createSocket('udp4');
var message = new Buffer("info");

srv.on('listening', function(){
    srv.setBroadcast(true);
});

srv.on('message', function (message, rinfo) {
    console.log('Message from: ' + rinfo.address + ':' + rinfo.port +' - ' + message);
	msg = new Buffer("info");
	srv.send(msg, 0, msg.length, rinfo.port, rinfo.address, function (err, bytes) {
	console.log("sent ACK.");
	});
});

srv.bind(PORT);
