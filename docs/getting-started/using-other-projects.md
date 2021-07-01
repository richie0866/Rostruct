# Using other projects

Using resources like libraries and utility modules in your projects can make development easier. However, resources aren't always distributed as a single Lua script.

For example, a UI library could be released as a Rostruct project with a deploy script that looks like this:

```lua
local Rostruct = loadstring(game:HttpGetAsync(
	"https://github.com/richie0866/Rostruct/releases/download/v1.2.3/Rostruct.lua"
))()

local package = Rostruct.fetchAsync("stickmasterluke", "MyModule")
local myModule = package:build("src/", { Name = "MyModule" })

return package:requireAsync(myModule)
```

Running a deploy script would be valid code in a Rostruct project. However, this is counterintuitive, and getting this library would yield the rest of your code.

Exercise caution when using Rostruct in a Rostruct project, or opt for another solution:

## In your project

Another way to load a dependency in your project is to include their source files in your codebase:

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

In general, most of the resources your project depends on should be included in your codebase. Rostruct is still in its beta phase, and may have unexpected behavior when using it inside another Rostruct project.

## In your script

If you're writing a script to distribute it in a single file, you should use the functions Rostruct provides, like [`fetch`](../api-reference/rostruct/fetch.md) and [`fetchLatest`](../api-reference/rostruct/fetchlatest.md), to load projects.

The project should be distributed with a way for you to load it with `loadstring` and `HttpGet`. However, if it isn't, follow [this guide](./publishing-your-project.md#running-your-project) to write it yourself.
