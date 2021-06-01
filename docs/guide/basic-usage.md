# Basic usage

!!! info
	This page assumes some familiarity with the Promise object. Check out their [extensive documentation](https://eryn.io/roblox-lua-promise/lib/) for more info.

## Build your project
Building projects is the core of Rostruct; it transforms the files into Roblox objects, and returns a `Project` interface.

To create a project that can be deployed with Rostruct, locate your executor's `workspace/` directory, insert a folder somewhere safe inside, write some code, and *voila*! Rostruct only needs the project files themselves to build them, and no other dependencies are necessary.

```lua
local project = Rostruct.Build("Projects/MyProject")
local MyProject = project.Instance
```

`Rostruct.Build` also takes an optional `parent` argument, mainly for debugging, so you can see what your project looks like after being built.

!!! info
	Use an explorer like "Dex Explorer" to view your project in Workspace

```lua
Rostruct.Build("Projects/MyProject", workspace)
```

If you'd like to rename the project instance, or manually make changes, you can!
`LocalScripts` and `ModuleScripts` are all run on deferred threads, allowing you to change the name of the project before they execute:

```lua
local project = Rostruct.Build("Projects/MyRepo/src")
project.Instance.Name = "Roact"
```

The code above also applies to all other Rostruct functions.

## Deploying your project
Deploying a project simply builds it and then executes every `LocalScript` on a deferred thread. It also adds an additional field to the `Project` interface: `RuntimePromises`, a list of promises that resolve with the script and what it returned. The code below is an example of how you could use this method:

!!! warning
	Runtime promises automatically time out after 30 seconds, avoid making a script take too long to execute!

```lua
local Promise = Rostruct.Loader.Install("Promise.lua"):expect()
local project = Rostruct.Deploy("Projects/RemoteSpy")

-- Waits for all scripts to finish executing:
Promise.all(project.RuntimePromises)
	:andThen(function(scriptsAndResults)
		print("Amount of scripts executed: " .. #scriptsAndResults)
		for _, scriptAndResult in ipairs(scriptsAndResults) do
			local obj = scriptAndResult[1]
			local result = scriptAndResult[2]
			print("Script " .. obj.Name .. " returned: " .. tostring(result))
		end
	end)
```

## Requiring a project
Requiring a project builds and deploys it, but adds another additional field: `RequirePromise`. This promise resolves with exactly what the module returned. The code below is an example of how you could use this method:

```lua
local project = Rostruct.Deploy("Projects/UILibrary")

-- Gets what Projects/UILibrary/init.lua returned:
local UILibrary = project.RequirePromise:expect()
UILibrary:create("Frame")
```

## Downloading from Github
GitFetch downloads the latest release (or a specified release) of a given repository, and returns a `GitFetchResult` interface. The code below is a basic implementation of `Rostruct.GitFetch` on [a declarative UI library for Roblox Lua, Roact](https://github.com/Roblox/roact/):

!!! note
	Currently, calling `Rostruct.GitFetch` with no `tag` provided yields the promise, even if the project is already cached. This behavior is expected to change in the near future.

```lua
Rostruct.GitFetch("Roblox", "roact"):andThen(function(gitFetchResult)
	local project = Rostruct.Require(gitFetchResult.Location .. "/src")
	return project.RequirePromise
end):andThen(function(Roact)
	print(Roact.createElement)
end)
```
