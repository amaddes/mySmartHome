cfg_wifi_ssid,cfg_wifi_key = "DEAD","0";
if (file.open('device.config'))then
   read_str = file.read()
   param = cjson.decode(read_str)
   cfg_wifi_ssid = param.ssid;
   cfg_wifi_key = param.key;
   file.close();
end
print(cfg_wifi_ssid);
print(cfg_wifi_key);
wifi.setmode(wifi.STATION);
wifi.sta.config(cfg_wifi_ssid,cfg_wifi_key);
wifi.sta.autoconnect(1);
-- tmr connect establish
tmr_count = 0;
tmr.alarm(0, 1000, 1, function()
  if(wifi.sta.getip() == nil)then
    -- wifi connect try
    print("Conn to AP (ssid="..cfg_wifi_ssid.."/key="..cfg_wifi_key..") try:"..tmr_count);
    tmr_count = tmr_count+1;
    if(tmr_count > 20)then 
      dofile("config.lua");
      tmr.stop(0);
    end
  else
    --print wifi status
    print('IP: ',wifi.sta.getip());
    print('Mode=Client');
    print('MAC:',wifi.sta.getmac());
    tmr.stop(0);
    dofile("udpserver.lua");
  end
end)
