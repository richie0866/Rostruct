# Execution model

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

We can get assets in `MyController.lua` with this code:

```lua
-- MyProject/Controllers/MyController.lua
local myProject = script:FindFirstAncestor("MyProject")

local Signal = require(myProject.Util.Signal)
local Date = require(myProject.Util.Date)
local Thread = require(myProject.Util.Thread)

local character = myProject.Assets.Character
```

!!! tip
	If you need a specific file, scripts run with Rostruct contain the `_ROOT` and `_PATH` globals to access the project files and the current file location, respectively.

## Catching Rostruct errors

Functions like [`Rostruct.Require`](../reference/functions.md#require) and [`Rostruct.Deploy`](../reference/functions.md#deploy) use Promises to manage yielding and error handling. Errors thrown during runtime can be caught using the `#!lua Promise:catch()` method:

```lua
buildResult.RuntimeWorker:catch(function(err)
	warn("A script failed to execute: " .. tostring(err))
end)
```

## Requiring your project

!!! warning
	You should generally avoid using Rostruct functions *inside* of your source code. Use this function if you're going to use a module outside of a Rostruct project.

If you need to quickly require a library in your script executor without deploying a new project, Rostruct has you covered with the [`Rostruct.Require`](../reference/functions.md#require) function.

The project you want to require must contain an `init.lua` file. This file tells Rostruct that the project turns into a ModuleScript. Check out the [file conversion](../reference/file-conversion.md) page for more information.

Let's say a project is structured like such:

* MyModule/
	* init.lua <small>(Nested ModuleScript)</small>
	* Util/
		* Signal.lua <small>(ModuleScript)</small>

The `init.lua` file tells Rostruct that the `MyModule/` directory should be turned into a ModuleScript. The module also inherits the source code of `init.lua`.

You can require modules with the following code snippet:

```lua
local project = Rostruct.Require("MyModule/")

local MyModule = project.Module:expect()
```

You can also use the GitHub Release functions Rostruct provides to download a library and use it.

## Best practices

* Only one LocalScript, if any, should manage module runtime
* Code should not rely on services like CollectionService that expose you to the client, make an alternative
* LocalScripts should try to finish ASAP and avoid yielding the main thread if possible
* The codebase should never be exposed to the `game` object to prevent security vulnerabilities
* Avoid using Rostruct in your project to load dependencies; Instead, check out [how to use a module](using-other-projects.md)
