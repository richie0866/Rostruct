# Getting started

**Rostruct** is a script execution library best used with [Rojo](https://rojo.space/docs/), a tool for syncing project files with Roblox Studio. Rostruct is designed to deploy Lua projects to Roblox script executors.

## Installation

When using Rostruct to test and debug your code in an exploiting environment, you can easily load the library for personal use.

### with HTTP GET <small>recommended</small> { data-toc-label="with HTTP GET" }

Rostruct can be installed with `HttpGetAsync`:

```lua
local VERSION = "TAG_VERSION_HERE"
local URL = "https://github.com/richie0866/Rostruct/releases/download/%s/Rostruct.lua"
local Rostruct = loadstring(game:HttpGetAsync(string.format(URL, VERSION)))()
```

This will load the Rostruct asset for the given [Github Release](https://github.com/richie0866/Rostruct/releases) tag name.

??? question "How do I get the tag name?"
	The tag name is **not** the name of the release. The tag name can be found to the left of the release name:
	![image](../images/github-tag-version.png)

### with `#!lua loadfile()`

Storing Rostruct in the filesystem is a great way to cut down on any loading time experienced when debugging. Save the latest `Rostruct.lua` file from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest) to your executor's `workspace/` directory. Load the Lua file with:

=== "loadfile"

	```lua
	local Rostruct = loadfile("rostruct/Rostruct.lua")()
	```

=== "loadstring-readfile"

	```lua
	local Rostruct = loadstring(readfile("rostruct/Rostruct.lua"))()
	```
