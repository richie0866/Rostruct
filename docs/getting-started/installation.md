# Installation

Learn how to integrate Rostruct into your workflow.

!!! warning
	Automatically getting the latest Rostruct release is discouraged, as **breaking changes** can happen at any time.
	
	Read the latest release's description when updating Rostruct just in case you need to change your code.

---

Rostruct is distributed as a Lua file. Before starting your local project, you should learn how to load Rostruct.

## with HTTP GET <small>recommended</small> { data-toc-label="with HTTP GET" }

Rostruct can be loaded with `HttpGetAsync`:

```lua hl_lines="3"
local Rostruct = loadstring(game:HttpGetAsync(
	"https://github.com/richie0866/Rostruct/releases/download/"
	.. "TAG_VERSION_HERE"
	.. "/Rostruct.lua"
))()
```

This will load the Rostruct script for the given [GitHub Release](https://github.com/richie0866/Rostruct/releases) **tag version**.

## with `#!lua loadfile()`

Prefer downloading Rostruct beforehand if you'd like to avoid yielding.

To do this, save the latest `Rostruct.lua` file from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest) somewhere in your executor's `workspace/` directory.

You can load the Lua file with:

=== "loadfile"

	```lua
	local Rostruct = loadfile("Rostruct.lua")()
	```

=== "loadstring-readfile"

	```lua
	local Rostruct = loadstring(readfile("Rostruct.lua"))()
	```
