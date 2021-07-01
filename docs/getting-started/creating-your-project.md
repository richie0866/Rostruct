# Creating your project

Rostruct turns your Lua projects into Roblox objects for a modern development experience. So, you should structure your codebase around Roblox Instances.

??? example "File conversion example"

	Check out the [file conversion](../api-reference/file-conversion.md) page for more complete information.
	
	![MyModule source](../assets/images/midi-player-src.png){ align=middle width=256px }
	-> [`Package.build`](../api-reference/package/methods/../build.md) ->
	![MyModule instance](../assets/images/midi-player-panel.svg){ align=middle width=256px }

Every Lua script is loaded with a [modified global environment](../api-reference/globals.md), making it nearly identical to running a LocalScript or ModuleScript. This includes the ability to require other modules in your project using the `#!lua require()` function.

To set up a project, locate your executor's `workspace/` directory and create a folder somewhere to host your project. You should store your codebase in a source folder, and that's all you need to start your project.

## Sync to Roblox as you write

With [Rojo](https://rojo.space/docs/), your project files sync to Roblox Studio in real-time, enabling a smooth development experience.

You can get [Rojo for VS Code](https://marketplace.visualstudio.com/items?itemName=evaera.vscode-rojo), which will install both the Rojo Roblox Studio plugin and the command-line interface.

## Building your project

Once you're ready to test your local project, you can build it with:

```lua
local package = Rostruct.open("projects/MyProject/")
local build = package:build("src/", { Name = "MyProject" })
```

Then, you can run every LocalScript in the project, or require a specific module:

```lua
-- Run all LocalScripts after the next Heartbeat event
package:start()

-- Require a specific module
local MyModule = package:require(build.MyModule)
```

For complete documentation, check out the [API reference](../api-reference/overview.md).

## Setting build metadata

Some scripts need to know the top-level instance to access other objects, like this:

```lua
local myProject = script:FindFirstAncestor("MyProject")

local Roact = require(myProject.Modules.Roact)

local character = myProject.Assets.Character
```

Typically, in Rojo, that Instance's name can be set in the `*.project.json` file. However, Rostruct does not (and will not!) support Rojo project files.

Though this can be achieved with the `props` argument in the [`Package:build`](../api-reference/package/build.md) method, you can also use **meta files** to keep things simple.

[Meta files](https://rojo.space/docs/6.x/sync-details/#meta-files) are a powerful tool from Rojo that tells Rostruct how to create the Instance for a specific file. For example, this meta file changes the name of the parent folder, `src/`:

=== "init.meta.lua"

	```json
	{
		"properties": {
			"Name": "MyProject"
		}
	}
	```

For a more detailed explanation, see Rojo's page on [meta files](https://rojo.space/docs/6.x/sync-details/#meta-files).
