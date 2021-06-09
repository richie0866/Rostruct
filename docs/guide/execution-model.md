# Execution model

## Using Rostruct for public use

!!! note
	Because Rostruct is written in TypeScript, it uses the TS module to load. This is black magic that should be taken at face value when viewing the code below. `TS.initialize("init")` essentially requires Rostruct straight from the source.

Before following this guide, make sure your Github repository has a [full release](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository) available. This is what Rostruct will use to download, cache, and deploy your project.

To finalize your script for public use, first download the latest release of Rostruct from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest). The file will end with `return TS.initialize("init")`. This line of code essentially requires Rostruct as a module and returns it, for use with `loadstring` or `loadfile`.

Because you will be using Rostruct from the source, replace `return TS.initialize("init")` with the following code:

```lua
local Rostruct = TS.initialize("init")
```

This is identical to other means of loading Rostruct using `loadstring` or `loadfile`, the only difference being that this is straight from the source, not through an online link or a file.

After loading Rostruct, use [`Rostruct.DownloadLatestRelease`](../api-reference.md#downloadlatestrelease) to download the latest release of your project. This function automatically caches, updates, and version checks your releases, so no further configuration is necessary. Using the [`DownloadResult`](../api-reference.md#downloadresult) object, you can deploy or build your project however necessary.

My [MidiPlayer script](../scripts-using-rostruct.md) is structured like such:

```lua
-- End of Rostruct v0.1.2-alpha

local Rostruct = TS.initialize("init")

-- Download the latest release to local files:
Rostruct.DownloadLatestRelease("richie0866", "MidiPlayer")
    :andThen(function(download)
        -- Require and set up:
        local project = Rostruct.Deploy(download.Location .. "src/")
        project.Instance.Name = "MidiPlayer"
    end)
```

No HTTP request is necessary to load Rostruct in this way. Thus, your project will deploy as soon as possible.

## Catching Rostruct errors

Functions like [`Rostruct.Require`](../api-reference.md#require) and [`Rostruct.Deploy`](../api-reference.md#deploy) use the Promise object to manage yielding and error handling. Errors thrown during runtime can be caught using the `Promise:catch` method:

```lua
buildResult.RuntimeWorker:catch(function(err)
	warn("A script failed to execute: " .. tostring(err))
end)
```

## Getting assets

A useful pattern is to keep all assets and dependencies within your project for immediate access. Let's say a project is structured like such:

* MyProject/
	* Runtime.client.lua (LocalScript)
	* Controllers/
		* MyController.lua (ModuleScript)
	* Assets/
		* Character.rbxm (Model)

We can write `MyController.lua` as such:

```lua
-- MyProject/Controllers/MyController.lua
local myProject = script:FindFirstAncestor("MyProject")

local character = myProject.Assets.Character
...
return MyController
```

!!! tip
	The same practice can be done to retrieve folders, modules, or any other instance in your project.

## Requiring a library

In order to use [`Rostruct.Require`](../api-reference.md#require), your project must contain an `init.lua` file. This file transforms the parent directory into a ModuleScript. A detailed explanation can be found in [Rojo's sync details](https://rojo.space/docs/6.x/sync-details/#scripts).

Let's say a project is structured like such:

* MyModule/
	* init.lua (Nested ModuleScript)
	* Util/
		* Signal.lua (ModuleScript)

We can require it as such:

```lua
local project = Rostruct.Require("MyModule/")

local MyModule = project.Module:expect()
```

And MyModule as an Instance would look like:

<img src="../images/MyModulePanel.svg" alt="MyModule as a Roblox instance" width=256px></img>

## Best practices

* Only one LocalScript, if any, should manage execution in your project
* Code should not rely on services like CollectionService that expose you to the client, make an alternative
* LocalScripts should try to finish ASAP, and avoid yielding the main thread if possible
* The codebase should never be exposed to the `game` object to prevent security vulnerabilities
