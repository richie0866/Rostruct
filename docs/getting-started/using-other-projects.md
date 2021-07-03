# Using other projects

!!! note

	This page is mainly for loading Rostruct projects **in another project**, and not in a single file.
	
	In a project distributed as a single script, you should load multi-file dependencies using the functions Rostruct provides, like [`fetch`](../api-reference/rostruct/fetch.md) and [`fetchLatest`](../api-reference/rostruct/fetchlatest.md).

Using resources like libraries and utility modules in your projects can make development easier. However, resources aren't always distributed as a single Lua script.

For example, a UI library could be released as a Rostruct project that loads itself like this:

```lua
local Rostruct = loadstring(game:HttpGetAsync(
	"https://github.com/richie0866/Rostruct/releases/download/v1.2.3/Rostruct.lua"
))()

local package = Rostruct.fetchAsync("stickmasterluke", "MyModule")
local myModule = package:build("src/", { Name = "MyModule" })

return package:requireAsync(myModule)
```

This is valid code in a Rostruct project. However, Rostruct is early in development, and may have unwanted side effects when using it *inside* a Rostruct project. This might change in the future, though.

Exercise caution when using Rostruct in a Rostruct project, or opt for another solution:

## Download it manually

!!! warning

	This method to load dependencies may be deprecated in favor of using Rostruct internally, so stay notified by watching the GitHub repository.

One way to load a dependency in your project is to include their source files in your codebase. You can download it with these steps:

1. Download the project's latest GitHub Release
	- If their [retriever](publishing-your-project.md#deploying-from-github) fetches a specific asset, then download that asset
2. Move the source somewhere in your project
	- If the source folder needs specific properties before runtime, use an [`init.meta.json`](creating-your-project.md#setting-build-metadata) file to set the properties, if not already provided.
	- If only the name is changed, change the name of the directory in your project files.
3. Use `#!lua require()` to load the module in your project

Once you've set up the files, Rostruct turns the dependencies into instances with the rest of your project, ensuring immediate access to them. You should use the global `#!lua require()` function to load them:

```lua hl_lines="3"
local myProject = script:FindFirstAncestor("MyProject")

local Roact = require(myProject.Modules.Roact)

local character = myProject.Assets.Character
```
