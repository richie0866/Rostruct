# Creating your project

Rostruct turns your Lua projects into Roblox objects and handles script runtime for you. Essentially, it's like [Rojo](https://rojo.space/), but for Roblox script execution.

So, before you start, remember that you can safely use the `script` and `#!lua require()` globals in your project. Every Lua script is loaded with a [modified global environment](../api-reference/globals.md), making it nearly identical to running a LocalScript or ModuleScript. See the [execution model](execution-model.md) for an example with asset management.

## Setup

To set up a project, locate your executor's `workspace/` directory and create a folder somewhere to host your project.

You can initialize a project with Rojo. However, if you don't have Rojo, you should create a folder that stores the source code of your project, and that's all you need to start coding.

## Sync to Roblox as you write

With [Rojo](https://rojo.space/), your project files sync to Roblox Studio in real-time. This can be an alternative to frequently restarting Roblox to test your code.

You can get [Rojo for VS Code](https://marketplace.visualstudio.com/items?itemName=evaera.vscode-rojo), which will install both the Rojo Roblox Studio plugin and the command-line interface.

## Building your project

Once you're ready to test your local project, you can build it with:

``` lua hl_lines="3 4"
local Rostruct -- Method to load Rostruct goes here

local package = Rostruct.open("projects/MyProject/")
local build = package:build("src/", { Name = "MyProject" })
```

Then, you can run every LocalScript in the project, or require a specific module:

``` lua
-- Run all LocalScripts after the next Heartbeat event
package:start()

-- Require a specific module
local MyModule = package:require(build.MyModule)
```

For complete documentation, check out the [API reference](../api-reference/overview.md).

## Setting build metadata

Some scripts need to know the top-level instance to access other objects, like this:

``` lua hl_lines="1"
local myProject = script:FindFirstAncestor("MyProject")

local Roact = require(myProject.Modules.Roact)

local character = myProject.Assets.Character
```

Typically, in Rojo, that instance's name can be set in the `*.project.json` file. However, Rostruct does not (and likely never will!) support Rojo project files.

Though this can be achieved with the `props` argument in the [`Package:build`](../api-reference/package/build.md) method, you can also use **meta files** to keep things simple.

[Meta files](https://rojo.space/docs/6.x/sync-details/#meta-files) are a powerful tool from Rojo that tells Rostruct how to create the Instance for a specific file. For example, this meta file changes the name of the parent folder, `src/`:

=== "src/init.meta.json"

	```json
	{
		"properties": {
			"Name": "MyProject"
		}
	}
	```

For more details, see Rojo's page on [meta files](https://rojo.space/docs/6.x/sync-details/#meta-files).
