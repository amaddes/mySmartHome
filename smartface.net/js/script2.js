var socket = new WebSocket("ws://10.33.0.56:8081");

// обработчик входящих сообщений
socket.onmessage = function(event) {
  var incomingMessage = event.data;
  showMessage(incomingMessage);
};

// показать сообщение в div#subscribe
function showMessage(message) {
	console.log(message);  
var lamp = document.getElementById('lamp1');
	if (message == 1){
		 lamp.src = "on.png";
	}

	if (message == 0) {
		 lamp.src = "off.png";
	}
}

