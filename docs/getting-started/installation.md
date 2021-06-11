# Setup

Learn how to integrate Rostruct into your workflow.

!!! warning
	Loading the latest Rostruct release automatically is discouraged, as **breaking changes** can happen at any time. Read the changelogs when updating Rostruct just in case need to change your code.

## Installation

When using Rostruct to test and debug your code in an exploiting environment, you can easily load the library for personal use.

### with HTTP GET <small>recommended</small> { data-toc-label="with HTTP GET" }

Rostruct can be installed with `HttpGetAsync`:

```lua
local VERSION = "TAG_VERSION_HERE"
local URL = "https://github.com/richie0866/Rostruct/releases/download/%s/Rostruct.lua"
local Rostruct = loadstring(game:HttpGetAsync(string.format(URL, VERSION)))()
```

This will load the Rostruct asset for the given [Github Release](https://github.com/richie0866/Rostruct/releases) **tag version**.

??? tip "How do I get the tag version?"
	![image](../assets/images/github-tag-version.png){ align=right width=512 }

	The tag version is **not** the name of the release.
	
	You can find the tag version to the left of the release name:

### with `#!lua loadfile()`

Storing Rostruct in the filesystem is a great way to cut down on any loading time experienced while debugging. Save the latest `Rostruct.lua` file from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest) to your executor's `workspace/` directory. Load the Lua file with:

=== "loadfile"

	```lua
	local Rostruct = loadfile("rostruct/Rostruct.lua")()
	```

=== "loadstring-readfile"

	```lua
	local Rostruct = loadstring(readfile("rostruct/Rostruct.lua"))()
	```
