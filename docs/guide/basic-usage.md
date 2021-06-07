# Basic usage

!!! note
	This page assumes some familiarity with the Promise object. Check out their [extensive documentation](https://eryn.io/roblox-lua-promise/lib/) for more info.

## Build your project
`Rostruct.Build` is the core of Rostruct; it transforms your project files into Roblox objects, and returns a `BuildResult` object.

![image](./images/example-vscode-and-roblox.png)

To set up a project, locate your executor's `workspace/` directory and create a folder somewhere to host your project. You can write code and insert model files, and they will be transformed into instances. Rostruct only needs the project files themselves, and no other dependencies are necessary.

```lua
local project = Rostruct.Build("Projects/MyProject/")
local MyProject = project.Instance
```

`Rostruct.Build` also takes an optional `parent` argument, mainly for debugging, to automatically parent your project to an instance.

```lua
Rostruct.Build("Projects/MyProject/", workspace)
```

If you'd like to rename the project, or modify the instance before scripts are run, you can!
`LocalScripts` and `ModuleScripts` are all run on deferred threads, allowing you to make your changes before they execute:

```lua
local project = Rostruct.Build("Projects/Roact/src/")
project.Instance.Name = "Roact"
```

The code above also applies to all other Rostruct functions.

## Deploy your project
Deploying a project builds it and then executes every `LocalScript` on a deferred thread. It also adds an additional field to the `BuildResult` object: `RuntimeWorker`, a Promise which resolves with every LocalScript in your project after they all finish executing. The code below is an example of how you could use this field:

!!! warning
	`RuntimeWorker` will automatically time out after 30 seconds of suspended execution, avoid making a script take too long to execute!

```lua
local project = Rostruct.Deploy("Projects/RemoteSpy/src/")

-- Waits for all scripts to finish executing:
project.RuntimeWorker:andThen(function(scripts)
	print("Amount of scripts executed: " .. #scripts)
	for _, obj in ipairs(scripts) do
		print("Script " .. obj.Name .. " executed!")
	end
end)
```

## Require a project
Requiring a project builds and deploys it, but adds another additional field: `Module`, a Promise which resolves with exactly what the module returned. The code below is an example of how to require a library:

```lua
local project = Rostruct.Require("Projects/UILibrary/lib/")

-- Gets what Projects/UILibrary/init.lua returned:
local UILibrary = project.Module:expect()
UILibrary:create("Frame")
```

## Download a Github release
Rostruct provides functions that allow a user to download and store a release from a Github repository.

The functions `Rostruct.DownloadRelease` and `Rostruct.DownloadLatestRelease` will download the release, with an optional asset target, and return a `DownloadResult` object.

!!! info
	By default, if the target asset is unspecified, Rostruct will download and extract the Source code zip file.
	Assets that are zip files will automatically be extracted. Otherwise, they are downloaded as a single file.
	![image](./images/github-asset.png)

The code below demonstrates using `Rostruct.DownloadRelease` on the [declarative UI library, Roact](https://github.com/Roblox/roact/):

```lua
-- Because the 4th parameter, 'asset,' isn't provided,
-- it will download the source code of the release (see info)
local downloadResult = Rostruct.DownloadRelease("Roblox", "roact", "v1.4.0"):expect()
local buildResult = Rostruct.Require(result.Location .. "src/")

local Roact = buildResult.Module:expect()
print(Roact.createElement)
```

You can also download a specific asset. In this example, it will download the `Roact.rbxm` asset from the v1.4.0 release:

```lua
-- Note that Rostruct does not require or execute model files!
-- They still get transformed, so only use them for asset management.
Rostruct.DownloadRelease("Roblox", "roact", "v1.4.0", "Roact.rbxm")
```
