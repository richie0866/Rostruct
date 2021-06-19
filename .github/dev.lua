
local Rostruct = TS.initialize("init")
local rostruct = Rostruct.build("tests/build/")

if (game.Lighting:FindFirstChild("build")) then
	game.Lighting.build:Destroy()
end
rostruct.tree.Parent = game.Lighting

rostruct:defer()
