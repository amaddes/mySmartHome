var socket = new WebSocket("ws://192.168.88.16:8081");
var typeOfClient = "web"
but = document.getElementById("lamp");

function switchbut(){ 
	if (but.src == "http://192.168.88.16/on.png") {
		but.src = "off.png"; 
		return;
		} 
	if (but.src == "http://192.168.88.16/off.png") {
		but.src = "on.png"; 
		return;
	}
};
but.onclick = switchbut;

// обработчик входящих сообщений
socket.onmessage = function(event) {
  var incomingMessage = event.data;
	switchbut();   
	console.log(incomingMessage);
  };


