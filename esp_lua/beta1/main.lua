cfg_wifi_ssid,cfg_wifi_key = "DEAD","0";
if (file.open('device.config'))then --если существует файл, читаем из него параметры Wi-Fi сети
   read_str = file.read()
   param = cjson.decode(read_str)
   cfg_wifi_ssid = param.ssid; -- SSID сети
   cfg_wifi_key = param.key; -- пароль
   file.close();
end

wifi.setmode(wifi.STATION); --перевод модуля в режим STATION
wifi.sta.config(cfg_wifi_ssid,cfg_wifi_key); --передача параметров сети
wifi.sta.autoconnect(1);
tmr_count = 0; -- количество попыток подключения
tmr.alarm(0, 1000, 1, function()
  if(wifi.sta.getip() == nil)then -- один раз в секунду проверяем получил ли модуль IP адрес
    -- wifi connect try
    print("Conn to AP (ssid="..cfg_wifi_ssid.."/key="..cfg_wifi_key..") try:"..tmr_count);
    tmr_count = tmr_count+1;
    if(tmr_count > 20)then -- если количество попыток получить IP адрес превысило 20, то переключаем модуль в режим настройки
      dofile("config.lua");
      tmr.stop(0);
    end
  else
    -- при успешном получении IP адреса выводим информацию(IP адрес, MAC, ....)
    print('IP: ',wifi.sta.getip());
    print('Mode=Client');
    print('MAC:',wifi.sta.getmac());
    tmr.stop(0);
    dofile("udpserver.lua"); -- запускаем UDP сервер
  end
end)
