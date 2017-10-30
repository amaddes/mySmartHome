if file.exists("device.config") then --если существует файл с настройками
    dofile("main.lua") -- выполнение основного кода
    else
    dofile("config.lua") --если, то запуск настройщика
end
