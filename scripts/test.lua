
local Rostruct = TS.initialize("init")

local function assertTypes(name, t, types)
	for k, v in pairs(types) do
		local keyName = name .. "." .. k
		if type(v) == "table" then
			assert(typeof(t[k]) == "table", "'" .. keyName .. "' is not of type 'table'")
			assertTypes(keyName, t[k], v)
		else
			assert(typeof(t[k]) == v, "'" .. keyName .. "' is not of type '" .. v .. "'")
		end
	end
end

warn("Assert package types")
do
	local package
	package = Rostruct.fetchAsync("Roblox", "roact", "v1.4.0")
	package = Rostruct.fetchLatestAsync("Roblox", "roact")
	assertTypes("(Roact) Package", package, {
		tree = "Instance",
		root = "string",
		fetchInfo = {
			location = "string",
			owner = "string",
			repo = "string",
			tag = "string",
			asset = "string",
			updated = "boolean",
		},
	})
end

warn("Test MidiPlayer")
do
	local package = Rostruct.open("MidiPlayer/")
	assertTypes("(MidiPlayer) Package", package, {
		tree = "Instance",
		root = "string",
		fetchInfo = "nil",
	})

	--[[
		Build project using start
	]]
	package:build("src/")
	package:start()

	--[[
		Require inner module
	]]
	assert(type(package:requireAsync(package.tree.MidiPlayer.MIDI)) == "table", "Failed to require Tree.MidiPlayer.MIDI")

	--[[
		Require specific file
	]]
	package:build("src/Util/Thread.lua")
	assert(type(package:requireAsync(package.tree.Thread)) == "table", "Failed to require Tree.Thread")
end

warn("Test all file types")
do
	local package = Rostruct.open("tests/build/")
	package:build()
	package:start():await()
end

warn("Require Roact")
do
	local package = Rostruct.fetchAsync("Roblox", "roact", "v1.4.0")
	
	local Roact = package:requireAsync(
		package:build("src/", { Name = "Roact" })
	)

	assert(
		type(Roact) == "table" and type(Roact.createElement) == "function",
		"Failed to require Roact"
	)
end

warn("Require Roact inline")
do
	local Roact = Rostruct.fetchLatest("Roblox", "roact")
		:andThen(function(package)
			return package:require(package:build("src/", { Name = "Roact" }))
		end)
		:expect()

	assert(
		type(Roact) == "table" and type(Roact.createElement) == "function",
		"Failed to require Roact inline with tree"
	)
end

warn("Require Roact inline with Roact.rbxm")
do
	local Roact = Rostruct.fetchLatest("Roblox", "roact", "Roact.rbxm")
		:andThen(function(package)
			package:build("Roact.rbxm")
			return package:require(package.tree.Roact)
		end)
		:expect()

	assert(
		type(Roact) == "table" and type(Roact.createElement) == "function",
		"Failed to require Roact inline with tree"
	)
end

print("Ok!")
