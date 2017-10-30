wifi.setmode(wifi.SOFTAP); -- переводим модуль в режим "Точка доступа"
wifi.ap.config({ssid="slamp",pwd="12345678"}); --параметры Wi-Fi сети
-- вывод в консоль информации для подключения к модулю
print("WiFi AP (ssid=slamp/key=12345678)");
print('IP:',wifi.ap.getip());
print('Mode=AP');
print('MAC:',wifi.ap.getmac());

srv=net.createServer(net.TCP) -- запуск TCP сервера
srv:listen(80,function(conn) 
    conn:on("receive", function(client,request)        
        local buf = "";
        local head = "HTTP/1.1 200 OK\n\n<!DOCTYPE HTML>\n<html>\n<head><meta content=\"text/html; charset=utf-8\"></head>\n<body>\n";
        local _, _, method, path, vars = string.find(request, "([A-Z]+) (.+)?(.+) HTTP");
        if(method == nil)then 
            _, _, method, path = string.find(request, "([A-Z]+) (.+) HTTP");
        end
        local _GET = {};
        local var_pos = {};
        var_pos[0] = 1;      
        if (vars ~= nil)then 
            vars = string.gsub(vars,"+"," ");
            len = string.len(vars);
            n = 1;
            i = 1;
            while i < len do
             var_pos[n] = string.find(vars, "&", i)+1;
             i = i+var_pos[n];
             n=n+1;
            end
            for i = 0, #var_pos-1 do
                substring = string.sub(vars, var_pos[i], (var_pos[i+1]-2))
                _GET[string.sub(substring, 1, (string.find(substring, "=")-1))] = string.sub(substring, (string.find(substring, "=")+1), string.len(substring));
            end
            substring = string.sub(vars, var_pos[#var_pos], len);    
            _GET[string.sub(substring, 1, (string.find(substring, "=")-1))] = string.sub(substring, (string.find(substring, "=")+1), string.len(substring));
        end
        if (restart == 1)then node.restart() end
        buf=head; 
        buf=buf.."<h2>WiFi Settings</h2>\n"
        buf=buf.."<h3>MAC: "..wifi.sta.getmac().."</h3>\n"
        buf=buf.."<form src=\"/\">"
        buf=buf.."<p>SSID:</p><input type=\"text\" name=\"ssid\" size=\"20\" value=\"\" maxlength=\"32\">"
        buf=buf.."<p>KEY:</p><input type=\"text\" name=\"key\" size=\"20\" value=\"\" maxlength=\"32\"><br>"
        buf=buf.."<br><button type=\"submit\" name=\"wifi\" value=\"SAVE\">Save</button>"
        buf=buf.."</form>\n" 
        if(_GET.wifi == "SAVE")then
           --save ssid or key to configfile in flash wrmem(_GET.ssid), wrmem(_GET.key)
           file.remove("device.config")
           file.open("device.config","w")
           local param = {}
           if ((_GET.ssid~=nil)and(_GET.ssid~=""))then param.ssid = _GET.ssid end 
           if ((_GET.key~=nil)and(_GET.key~=""))then param.key = _GET.key end
           if ((param.ssid~=nil)and(param.key~=nil)) then 
                                                        file.write(cjson.encode(param)) 
                                                        print(cjson.encode(param))
                                                     end
           file.close()
           buf=head
           buf=buf.."<h2>Save OK!</h2>\n<form><input type=\"button\" value=\"OK and Reboot\" onclick=\"javascript:window.location=\'/\'\"/></form>\n"
           restart=1
        end     
        buf=buf.."</body></html>"
        client:send(buf)
        client:close()
        collectgarbage()
    end)
end)
