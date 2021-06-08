# Setting up

## Loading Rostruct

The latest Rostruct Luau source is available from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest).

### From Github
* Locate the latest release of Rostruct from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest)
* Right-click the `Rostruct.lua` asset and copy the URL (ends with `/releases/download/TAGNAME/Rostruct.lua`)
* Load Rostruct from the URL:
```lua
local Rostruct = loadstring(game:HttpGetAsync(".../releases/download/TAGNAME/Rostruct.lua"))()
```

### From local files
* Download the latest `Rostruct.lua` file from the [Github Releases page](https://github.com/richie0866/Rostruct/releases/latest)
* Locate your executor's `workspace/` directory and insert `Rostruct.lua` into a folder named "rostruct"
* Load Rostruct from the file:
```lua
local Rostruct = loadfile("rostruct/Rostruct.lua")()
local Rostruct = loadstring(readfile("rostruct/Rostruct.lua"))()
```

## Setting up a project

It is recommended you set up a VS Code project [with useful extensions](../index.md#use-with-other-tools) to easily get started on a project. This way, you can focus on testing your code in Roblox Studio, then execute with Rostruct when you're ready. Rojo has useful commands like `rojo init` (`Rojo: Initialize` in the VSCode command palette) to get you started on a project.
