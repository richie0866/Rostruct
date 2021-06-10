# Basic usage

## [Build](../reference/functions.md#build) a project

`Rostruct.Build` is the core of Rostruct; it transforms your project files into Roblox objects, and returns a `BuildResult` object.

```lua
local project = Rostruct.Build("Projects/MidiPlayer/src/")
local midiPlayer = project.Instance
```

???+ tip
	If you'd like to rename the project, modifying the instance before runtime, you can!

	Regardless of whether you deploy or require the project, `LocalScripts` and `ModuleScripts` are all run on deferred threads, allowing you to make your changes before they execute:

	```lua
	local project = Rostruct.Deploy("Projects/MidiPlayer/src/")
	project.Instance.Name = "MidiPlayer"
	```

## [Deploy](../reference/functions.md#deploy) scripts

Deploying a project builds it and then executes every `LocalScript` on a deferred thread. It also adds a field to the `BuildResult` object: `RuntimeWorker`, a Promise that resolves with every LocalScript in your project after each execution job is complete.

!!! info
	`RuntimeWorker` will automatically time out after 30 seconds of suspended execution; Avoid making a script take too long to execute!

The code below is an example of how you could use this field:

```lua
local project = Rostruct.Deploy("Projects/Hydroxide/src/")

-- Waits for all scripts to finish executing:
project.RuntimeWorker:andThen(function(scripts)
	print("Amount of scripts executed: " .. #scripts)
	for _, obj in ipairs(scripts) do
		print("Script " .. obj.Name .. " executed!")
	end
end)
```

## [Require](../reference/functions.md#require) a library

Requiring a project builds and deploys it, but adds another additional field: `Module`, a Promise that resolves with exactly what the module returned.

The code below is an example of how to require a library:

```lua
local project = Rostruct.Require("Projects/UILibrary/lib/")

-- Gets what UILibrary/lib/init.lua returned:
local UILibrary = project.Module:expect()
UILibrary:create("Frame")
```

## Download a Github release

Rostruct provides a set of functions that allow users to download and save releases from a Github repository.

The functions [`Rostruct.DownloadRelease`](../reference/functions.md#downloadrelease) and [`DownloadLatestRelease`](../reference/functions.md#downloadlatestrelease) will download the release, with an optional asset target, and return a `DownloadResult` object.

???+ info

	![image](../images/github-asset.png){ align=right }

	By default, if the `asset` is unspecified, Rostruct will download and extract the Source code zip file.
	
	Downloading a release extracts `.zip` assets to a folder in the cache. Otherwise, it places the original file in the folder.

The code below demonstrates using `Rostruct.DownloadRelease` on the [declarative UI library, Roact](https://github.com/Roblox/roact/):

```lua
-- Downloads the source code of Roact v1.4.0
-- and waits for the Promise to finish:
local download = Rostruct.DownloadRelease("Roblox", "roact", "v1.4.0"):expect()

-- Output something if it's a new download:
if download.Updated then
	print("Roact v1.4.0 installed!")
end

-- Requires Roact:
local Roact = Rostruct.Require(download.Location .. "src/").Module:expect()
```

You can also download a specific asset. This example downloads the `Roact.rbxm` asset from the v1.4.0 release of Roact:

```lua
-- Note that Rostruct does not require or execute model files!
-- They still get transformed, so only use them for asset management.
Rostruct.DownloadRelease("Roblox", "roact", "v1.4.0", "Roact.rbxm")
```
