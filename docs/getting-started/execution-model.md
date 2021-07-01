# Execution model

## Asset management

A useful pattern is to keep all assets within your project for immediate access. Let's say a project is structured like such:

* src/
	* Assets/
		* Character.rbxm <small>(Model)</small>
	* Controllers/
		* MyController.lua <small>(ModuleScript)</small>
	* Util/
		* Signal.lua <small>(ModuleScript)</small>
		* Date.lua <small>(ModuleScript)</small>
		* Thread.lua <small>(ModuleScript)</small>
	* init.meta.json <small>(Renames 'src' to 'MyProject')</small>

We can write `MyController.lua` to get assets with this code:

```lua
-- MyProject/Controllers/MyController.lua
local myProject = script:FindFirstAncestor("MyProject")

local Signal = require(myProject.Util.Signal)
local Date = require(myProject.Util.Date)
local Thread = require(myProject.Util.Thread)

local character = myProject.Assets.Character
```

!!! tip
	If you need a specific file, scripts run with Rostruct contain the `_ROOT` and `_PATH` globals to access the root directory and the current file location, respectively.

## Catching Rostruct errors

Functions like [`Rostruct.fetch`](../api-reference/rostruct/fetch.md) and [`Package:require`](../api-reference/package/require.md) use Promises to manage yielding and error handling.

Errors thrown during runtime can be caught using the `#!lua Promise:catch()` method:

```lua
package:start()
	:catch(function(err)
		if Promise.Error.isKind(err, Promise.Error.Kind.TimedOut) then
			warn("Script execution timed out!")
		else
			warn("Something went wrong: " .. tostring(err))
		end
	end)
```

## Best practices

* Only one LocalScript, if any, should manage module runtime
* Code should not rely on services like CollectionService that expose you to the client, so use an alternative
* LocalScripts should try to finish ASAP and avoid yielding the **main thread** if possible
* The codebase should never be exposed to the `game` object to prevent security vulnerabilities
* Avoid using Rostruct in your project to load dependencies; Instead, check out [how to use a module](using-other-projects.md)
