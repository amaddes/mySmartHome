var mongoClient = require("mongodb").MongoClient;
var WebSocketServer = new require('ws');
var dgram = require('dgram');
var UDP_PORT = 5000;
var WEBSOCET_PORT = 8081
var clients = {};
var webclient = [];
var sdevice = [];
var newDevice
var url = "mongodb://localhost:27017/smartdb"; 

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

var initMsg = {
	magic:"&INIT"
		}
		
var answMsg = {
	magic:"&ANSW"
		}
		
var watchMsg = {
	magic:"&ALIVE"
}

var statusMsg = {
	magic:"&STATUS",
	clientList:''
}

var watchDog = setInterval (function () {
			mongoClient.connect(url, function(err, db) {
										if(err) {console.log(err);}
										var collection = db.collection("clients");
										var clients = collection.find({"devStatus":"active"});
										clients.forEach(function (obj){
											var presetDate = new Date();
											if ((presetDate - obj.lastOnline)> 5000){
												var collection = db.collection("clients");
												collection.update({"devId" : obj.devId}, {$set :{"devStatus" : "inactive"}});
												SendStatus(clients);
												console.log(obj.devId+" - offline!");
											}
										});
										//db.close();
										});										
		}, 500); 


function SendStatus(clients) {
	mongoClient.connect(url, function(err, db) {
	 if(err) {console.log(err);}
	 var collection = db.collection("clients");
	 var activeClients = collection.find({"devStatus":"active"});
	 var activePanel = collection.find({"devStatus":"active", "devType":"Control Panel"});
		activeClients.toArray(function (err, obj){
		activePanel.forEach( function (result){
		//console.log(obj);
		statusMsg.clientList = obj;
		//console.log(clients[result.connectionId]);
		if (clients[result.connectionId] != undefined){
		clients[result.connectionId].send(JSON.stringify(statusMsg));
		}
	 });
	});	
	})
}

webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение.....");
  ws.send(JSON.stringify(initMsg));
  ws.on('message', function(message) {
			msg = JSON.parse(message);
			if (msg.magic == '&CONFIG') {
									mongoClient.connect(url, function(err, db) {
										if(!err) {}
										var collection = db.collection("clients");
										collection.find({"devId":msg.devId}).toArray(function (err, docs) {
														if (docs.length == 0){
															console.log("net v baze");
															collection.insert({
																	"devId":msg.devId,
																	"devType":msg.devType,
																	"connectionId":id,
																	"addDate": new Date(),
																	"lastModifDate": new Date(),
																	"lastOnline": new Date(),
																	"devStatus" : "active"
															});
															console.log("dobavlen v bazu!");
															ws.send(JSON.stringify(answMsg));
															SendStatus(clients);
															}
														else {
															console.log("est v baze");
															collection.update({"devId" : msg.devId}, {$set : {
																									connectionId : id,
																									lastModifDate : new Date(),
																									lastOnline: new Date(),
																									devStatus : "active"
																									}});
															console.log("obnovili informaciu o kliente");
															ws.send(JSON.stringify(answMsg));
															SendStatus(clients);
														}
										});
									});
						console.log(id+"-connectionId");
						console.log(msg.devId+"-devId");
						console.log(msg.devType+"-devType");
						}
			if (msg.magic == '&ALIVE') {
					mongoClient.connect(url, function(err, db) {
										if(err) {console.log(err);}
										var collection = db.collection("clients");
										collection.update({"devId" : msg.devId}, {$set : {lastOnline: new Date(), devStatus : "active"}});
															db.close();
															SendStatus(clients);
														});
			}
					});

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });
});
