# Execution model

When creating a Rostruct project, you should script with instances in mind. Since this library will turn your codebase into Roblox instances, your files should behave as scripts running in Roblox Studio.

Rostruct turns your files into Roblox objects, and every Lua script executes as a script object. As a result, your code can require other modules using the `#!lua require()` function as you would in Roblox Studio.

??? example "File conversion"

	=== "Source code"

		![MyModule source](../images/midi-player-src.png){ width=256px }

	=== "Rostruct"

		![MyModule instance](../images/MidiPlayerPanel.svg){ width=256px }

## Getting assets

A useful pattern is to keep all assets and dependencies within your project for immediate access. Let's say a project is structured like such:

* MyProject/
	* Runtime.client.lua <small>(LocalScript)</small>
	* Controllers/
		* MyController.lua <small>(ModuleScript)</small>
	* Util/
		* Signal.lua <small>(ModuleScript)</small>
		* Date.lua <small>(ModuleScript)</small>
		* Thread.lua <small>(ModuleScript)</small>
	* Assets/
		* Character.rbxm <small>(Model)</small>

We can write `MyController.lua` as such:

```lua
-- MyProject/Controllers/MyController.lua
local myProject = script:FindFirstAncestor("MyProject")

local Signal = require(myProject.Util.Signal)
local Date = require(myProject.Util.Date)
local Thread = require(myProject.Util.Thread)

local character = myProject.Assets.Character
...
return MyController
```

!!! tip
	If you need a specific file, scripts run with Rostruct contain the `_ROOT` and `_PATH` globals to access the project files and the current file location, respectively.

## Catching Rostruct errors

Functions like [`Rostruct.Require`](../reference/functions.md#require) and [`Rostruct.Deploy`](../reference/functions.md#deploy) use the Promise object to manage yielding and error handling. Errors thrown during runtime can be caught using the `#!lua Promise:catch()` method:

```lua
buildResult.RuntimeWorker:catch(function(err)
	warn("A script failed to execute: " .. tostring(err))
end)
```

## Requiring a library

In order to use [`Rostruct.Require`](../reference/functions.md#require), your project must contain an `init.lua` file. This file transforms the parent directory into a ModuleScript. You can find a detailed explanation in [Rojo's sync details](https://rojo.space/docs/6.x/sync-details/#scripts).

Let's say a project is structured like such:

* MyModule/
	* init.lua <small>(Nested ModuleScript)</small>
	* Util/
		* Signal.lua <small>(ModuleScript)</small>

We can require it as such:

```lua
local project = Rostruct.Require("MyModule/")

local MyModule = project.Module:expect()
```

## Best practices

* Only one LocalScript, if any, should manage module runtime
* Code should not rely on services like CollectionService that expose you to the client, make an alternative
* LocalScripts should try to finish ASAP and avoid yielding the main thread if possible
* The codebase should never be exposed to the `game` object to prevent security vulnerabilities
