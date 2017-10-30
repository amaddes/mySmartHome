wifi.setmode(wifi.SOFTAP);
wifi.ap.config({ssid="slamp",pwd="12345678"});
print("WiFi AP (ssid=slamp/key=12345678)");
print('IP:',wifi.ap.getip());
print('Mode=AP');
print('MAC:',wifi.ap.getmac());
-- create a server
    sv=net.createServer(net.TCP, 30)    -- 30s time out for a inactive client
    -- server listen on 80, if data received, print data to console, and send "hello world" to remote.
    sv:listen(80,function(conn)
      conn:on("receive", function(client,request)        
        local buf = "";
        local head = "HTTP/1.1 200 OK\n\n<!DOCTYPE HTML>\n<html>\n<head><meta content=\"text/html; charset=utf-8\"></head>\n<body>\n";
        local _, _, method, path, vars = string.find(request, "([A-Z]+) (.+)?(.+) HTTP");
        if(method == nil)then 
            _, _, method, path = string.find(request, "([A-Z]+) (.+) HTTP");
        end
        print(method);
        print(path);
        print(vars);
        local _GET = {}      
        if (vars ~= nil)then 
            for k, v in string.gmatch(vars, "(%w+)=(%w+)&*") do 
                _GET[k] = v; 
            print(k);
            print(v)
            end 
        end
      end)
    end)    