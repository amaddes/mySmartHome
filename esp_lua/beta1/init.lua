if file.exists("device.config") then
    dofile("main.lua")
    else
    dofile("config.lua")
end
