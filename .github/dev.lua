
local Rostruct = TS.initialize("init")

local build
build = Rostruct.build("Util/MidiPlayer/src/")
build = Rostruct.fetch("src/", "Roblox", "roact", "v1.4.0"):expect()
build = Rostruct.fetchLatest("src/", "Roblox", "roact"):expect()

table.foreach(build.fetchInfo, print)

local roact = build.tree
roact.Name = "Roact"

-- Simulate localscript runtime
local scriptsPromise = build:defer()
print(scriptsPromise)

local Roact

-- Require top-level instance
Roact = build:require():expect()
print(Roact.createElement)

-- Require top-level instance (async)
Roact = build:requireAsync()
print(Roact.createElement)

-- Require Roact (inline)
Roact = Rostruct.fetchLatest("src/", "Roblox", "roact")
	:expect()
    :set({ Name = "Roact" })
    :requireAsync()
print(Roact.createElement)
