# Setup

Learn how to integrate Rostruct into your workflow.

!!! warning
	Automatically getting the latest Rostruct release is discouraged, as **breaking changes** can happen at any time.
	
	Read the changelogs when updating Rostruct just in case you need to change your code.

## What you need to know

This guide assumes:

- [x] You're familiar with development in an external code editor.
  * If you're unsure of how to manage Roblox projects externally, [Rojo's documentation](https://rojo.space/docs/) provides an in-depth explanation of how it works and why you should do it.

- [x] You understand how to use the Promise object.
  * You can refer to evaera's [Promise documentation](https://eryn.io/roblox-lua-promise/), a detailed guide on the purpose and use of the Promise object. 

## Installation

Rostruct is distributed as a Lua file. Before starting your local project, you'll need to set it up with your exploit.

### with HTTP GET <small>recommended</small> { data-toc-label="with HTTP GET" }

Rostruct can be installed with `HttpGetAsync`:

```lua
local VERSION = "TAG_VERSION_HERE"
local URL = "https://github.com/richie0866/Rostruct/releases/download/%s/Rostruct.lua"
local Rostruct = loadstring(game:HttpGetAsync(string.format(URL, VERSION)))()
```

This will load the Rostruct script for the given [GitHub Release](https://github.com/richie0866/Rostruct/releases) **tag version**.

??? tip "How do I get the tag version?"
	![image](../assets/images/github-tag-version.png){ align=right width=512 }

	The tag version is **not** the name of the release.
	
	You can find the tag version to the left of the release name:

### with `#!lua loadfile()`

Storing Rostruct in the filesystem is a great way to cut down loading times during development. Save the latest `Rostruct.lua` file from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest) to your executor's `workspace/` directory. You can load the Lua file with:

=== "loadfile"

	```lua
	local Rostruct = loadfile("Rostruct.lua")()
	```

=== "loadstring-readfile"

	```lua
	local Rostruct = loadstring(readfile("Rostruct.lua"))()
	```
