function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  
  function setCookie(name, value, options) {
    options = options || {};
  
    var expires = options.expires;
  
    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }
  
    value = encodeURIComponent(value);
  
    var updatedCookie = name + "=" + value;
  
    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }
  
    document.cookie = updatedCookie;
  }
  
  function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }
  
  expDate = new Date('Tue, 19 Jan 2038 03:14:07 GMT')
  
  options = {
      expires : expDate
  }
  
  devId = getCookie('devId');
  
  if (devId == '') {
          devId = getRandomArbitrary(1, 10000000).toString();
          setCookie('devId', devId, options);
  }
  
  var devParam = {
          magic:'',
          devId:devId,
          devType:"Control Panel"
          }
  
  var watchMsg = {
      magic:"&ALIVE",
      devId:devId
  }		
          
  var socket = new WebSocket("ws://10.33.0.40:8081"); 
  
  
  
  
  setTimeout(function () {
      var watchDog = setInterval (function () {
      
      if (socket.readyState != 1) {
                  clearInterval(watchDog)
                  } 
                  else {
                  socket.send(JSON.stringify(watchMsg));
                  }
      }, 100);
  }, 1000);
  
  socket.onmessage = function (event) {
      msg = JSON.parse(event.data);
      if (msg.magic=="&INIT"){
          devParam.magic = "&CONFIG";
          answMsg = JSON.stringify(devParam);
          socket.send(answMsg);
      }
      if (msg.magic=="&ANSW"){
          console.log("otvet poluchen");
      }
      if (msg.magic=="&ALIVE"){
          console.log("ya jivoi");
      }
      if (msg.magic=="&STATUS"){
          spisok=document.getElementById("clientList");
          spisok.innerHTML = ""
          //console.log(msg.clientList);
          for ( i=0; i < msg.clientList.length; i++) {
              spisok.innerHTML += "id - "+msg.clientList[i].devId+" Type - "+msg.clientList[i].devType+"</br>";
          }
      }
  }