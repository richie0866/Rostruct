# Using other projects

Using resources like libraries and utility modules in your projects can make development easier. However, resources aren't always distributed as a single Lua script.

For example, a UI library could be released as a Rostruct project with a deploy script that looks like this:

```lua
-- Rostruct loading goes here

local download = Rostruct.DownloadLatestRelease(
	"stickmasterluke",
	"MyModule"
):expect()

local project = Rostruct.Require(download.Location .. "src/")
project.Instance.Name = "Roact"

return project.Module:expect()
```

Running a deploy script would be valid code in a Rostruct project. However, getting this library would yield the rest of your code. As one of the goals of Rostruct is to load assets *before* runtime, this is bad practice.

## Local dependencies

The best way to load a dependency in your Rostruct project is to include their source files in your codebase. You can achieve this by downloading source files through a stable GitHub Release yourself.

??? example "How do I include a Rostruct project?"

	1. Download the project's latest GitHub Release
		- If the deploy script specifies an **asset** to download, then download that asset
	2. Move their source somewhere easy to access in your project
		- If the source folder needs specific properties before runtime, use an [`init.meta.json`](creating-your-project.md#setting-build-metadata) file to set properties, if not already provided.
		- If only the name is changed, change the name of the directory in your project files.
	3. Use `#!lua require()` to load the module

Once you've set up the files, Rostruct turns the dependencies into instances with the rest of your project, ensuring safe, immediate access to them. You should use the global `#!lua require()` function to load them:

```lua
local myProject = script:FindFirstAncestor("MyProject")

local Roact = require(myProject.Modules.Roact)

local character = myProject.Assets.Character
```

In general, most of the resources your project depends on should be included in your codebase, This ensures a quality user experience and minimizes loading times.
