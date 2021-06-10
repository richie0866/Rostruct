# Creating your project

To set up a project, locate your executor's `workspace/` directory and create a folder somewhere to host your project. It's recommended to integrate Rojo into your workflow to test your code in Roblox Studio.

## Sync to Roblox as you write

Rostruct is designed to complement a workflow using [Rojo](https://rojo.space/docs/), a project management tool. Rojo syncs your files to Roblox Studio in real-time, allowing you to preview and to test your code.

You can install [the Rojo VS Code extension](https://marketplace.visualstudio.com/items?itemName=evaera.vscode-rojo), which will install both the Rojo Roblox Studio plugin and the command line interface.

## Building your project

When you've finished setting up and writing your code, you can deploy or require your project with:

=== "Deploy"

	```lua
	local build = Rostruct.Deploy("projects/MyProject/src/")
	```

=== "Require"

	```lua
	local build = Rostruct.Require("projects/MyModule/src/")
	local MyModule = build.Module:expect()
	```

The contents of the folder you pass to these functions are transformed into Roblox objects for an intuitive, Roblox Studio-like environment. More details can be found in [the execution model](execution-model.md).
