print("Ready!")
if (file.open('device.config'))then
   read_str = file.read()
   param = cjson.decode(read_str)
   file.close();
end
ws = websocket.createClient()
ws:connect('ws://'..param.webSocketSrvIp..':'..param.webSocketSrvPort)
ws:on('receive', function(s, message)
                    print(message)
                 end)
n=0
gpio.mode(5, gpio.INPUT)
gpio.mode(1, gpio.OUTPUT,gpio.FLOAT)
gpio.trig(5, 'low', function(level)
    tmr.delay(300000)
    if ((gpio.read(1)==1)) then gpio.write(1, gpio.LOW) else gpio.write(1,gpio.HIGH) end
    print(n)
    n=n+1
    ws:send("switch1")
end)
