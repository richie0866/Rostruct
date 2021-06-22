
local Rostruct = TS.initialize("init")

local function forEach(t, f)
	for i, v in pairs(t) do
		f(i, v)
	end
end

warn("\n--- Fetch GitHub release ---")
do
	local package
	package = Rostruct.fetchAsync("Roblox", "roact", "v1.4.0")
	package = Rostruct.fetchLatestAsync("Roblox", "roact")
	forEach(package.fetchInfo, print)
end

warn("\n--- Test MidiPlayer ---")
do
	local package = Rostruct.new("Util/MidiPlayer/")

	--[[
		Build project using start
	]]
	package:build("src/", { Name = "MidiPlayer" })
	print(package:start())

	--[[
		Require inner module
	]]
	warn("--- MIDI ---")
	forEach(package:requireAsync(package.tree.MidiPlayer.MIDI), print)
	warn("--- End of MIDI ---")

	--[[
		Require specific file
	]]
	warn("--- Thread ---")
	package:build("src/Util/Thread.lua")
	forEach(package:requireAsync(package.tree.Thread), print)
	warn("--- End of Thread ---")
end

warn("\n--- Try all file types ---")
do
	local package = Rostruct.new("tests/build/")
	package:build()
	package:start():await()
end

warn("\n--- Require Roact ---")
do
	local package = Rostruct.fetchAsync("Roblox", "roact", "v1.4.0")
	
	local Roact = package:requireAsync(
		package:build("src/", { Name = "Roact" })
	)

	print(Roact.createElement)
end

warn("\n--- Require Roact (inline) ---")
do
	local Roact = Rostruct.fetchLatest("Roblox", "roact")
		:andThen(function(rostruct)
			return rostruct:require(rostruct:build("src/", { Name = "Roact" }))
		end)
		:expect()

	print(Roact.createElement)
end

warn("\n--- Require Roact (inline + tree) ---")
do
	local Roact = Rostruct.fetchLatest("Roblox", "roact")
		:andThen(function(rostruct)
			rostruct:build("src/", { Name = "Roact" })
			return rostruct:require(rostruct.tree.Roact)
		end)
		:expect()

	print(Roact.createElement)
end
