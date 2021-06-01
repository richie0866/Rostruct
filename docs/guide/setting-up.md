# Setting up

!!! warning
	Avoid malicious scripts that may tamper with your project files!

## Loading the Rostruct library

The latest Rostruct Luau source is available from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest).

### From Github
* Locate the latest release of Rostruct from the [Releases page](https://github.com/richie0866/Rostruct/releases/latest)
* Copy the URL of the `Rostruct.lua` asset (ends with `/releases/download/TAGNAME/Rostruct.lua`)
* Load the Rostruct library from the URL:

```lua
local url = ".../releases/download/TAGNAME/Rostruct.lua"
local Rostruct = loadstring(game:HttpGetAsync(url))()
```

### From local files
* Download the latest `Rostruct.lua` file from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest)
* Locate your executor's `workspace/` directory and insert `Rostruct.lua` into a folder named "rostruct"
* Load the Rostruct library from the file:

```lua
local Rostruct = loadfile("rostruct/Rostruct.lua")()
local Rostruct = loadstring(readfile("rostruct/Rostruct.lua"))()
```

## Setting up a project

It is recommended you set up a VSCode project [with extensions](../index.md#use-with-other-tools) to easily get started on a project. This way, you can focus on safely testing in Roblox Studio, then execute with Rostruct when you're ready. Rojo has useful commands like `rojo init` (`Rojo: Initialize` in the VSCode command palette) to get started on a project quickly.
