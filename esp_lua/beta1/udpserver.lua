if (file.open('device.config'))then
   read_str = file.read()
   param = cjson.decode(read_str)
   file.close();
   if ((param.webSocketSrvIp~=nil)and(param.webSocketSrvPort~=nil)) then dofile("websocketclient.lua")
else   
port=5000
print("IP:"..wifi.sta.getip()..", Port:"..port)
client=net.createConnection(net.UDP)
client:connect(port, "255.255.255.255")
tmr.create():alarm(2000,tmr.ALARM_AUTO, function()
    client:send(node.chipid())
    end)
client:on("receive", function(sck, c) 
                        param = cjson.decode(c)
                        if (param.magic == "&SETUP") then
                            file.open('device.config')
                            read_str = file.read()
                            readParam = cjson.decode(read_str)
                            readParam.webSocketSrvIp = param.ip
                            readParam.webSocketSrvPort = param.port
                            file.close()
                            file.remove("device.config")
                            file.open("device.config","w")
                            file.write(cjson.encode(readParam))
                            file.close()
                            sck:close()
                            dofile("websocketclient.lua");
                        end
                     end)
    end
end