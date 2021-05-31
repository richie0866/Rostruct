<h1 align="center">Rostruct</h1>
<div align="center">
	<a href="https://github.com/richie0866/Rostruct/actions"><img src="https://github.com/richie0866/Rostruct/workflows/ESLint/badge.svg" alt="GitHub Actions ESLint Status" /></a>
	<a href="https://github.com/richie0866/Rostruct/releases/latest"><img src="https://github.com/richie0866/Rostruct/workflows/Release/badge.svg" alt="GitHub Actions Release Status" /></a>
	<a href="https://richie0866.github.io/Rostruct"><img src="https://img.shields.io/badge/docs-website-blue.svg" alt="Rostruct Documentation" /></a>
</div>

<div align="center">
	A project framework inspired by Rojo.
</div>

---

`Rostruct` is a file execution framework, built in [TypeScript](https://roblox-ts.com/), that deploys Lua projects to a Roblox script executor. This framework is a substitute for implementations using excessive `HttpGetAsync` and `GetObjects` calls. Rostruct works to bring the modern [Rojo](https://rojo.space/docs/6.x/sync-details/) workflow to exploiting.

Whether you're familiar with Rojo, dislike loading assets during runtime, or simply want to lazy-load scripts, you might enjoy using this library. 

See the original concept [here](https://v3rmillion.net/showthread.php?tid=1081675).

## Introduction
Typically, large projects are stored in a single large, complicated file, spanning thousands of lines. Cluttered scripts can disrupt workflow and make development difficult overall.

This contrasts with scripting in Roblox Studio or Rojo, which allows scripts, modules, and assets to depend on each other without loading during runtime. To achieve these benefits, Rostruct converts your project to Roblox instances before executing your code. Instead of waiting for assets to load, you can expect them to be there.

## How it works
How does Rostruct build instances?
* First, Rostruct scans the project for a `src/` or `lib/` directory to build. Otherwise, the original path is used.
* Then, files compatible with Rostruct (`lua`, `json`, `rbxm`, etc.) are converted to Roblox instances following an intuitive [file conversion model](https://richie0866.github.io/Rostruct).

What does deploying a project do?

* Projects can be deployed or required. If the project was deployed, Rostruct executes every `LocalScript` in the instance tree.
* If the project was required, and the project results in a `ModuleScript`, it requires the module and stores the result.

Every script that runs comes with preset `script` and `require` variables, in order to closely mirror an **Instance-based** Rojo & Roblox Studio workflow.

## Features
* Promotes modular programming
  * Ensure quality readability, debugging, and maintainability in your projects.
* Instance-based execution
  * Run your projects in an environment that closely mirrors a Rojo & Roblox Studio workflow.
* Github support
  * Install and deploy projects directly from Github releases.
* Builds `rbxm` models
  * Go `GetObjects`-free by loading models directly from your project. **This feature requires `getcustomasset`!**
* [Rojo](https://github.com/rojo-rbx/rojo#readme) support
  * Easily test your code in Roblox Studio before executing it.
* Loader library for lazy-loading modules
  * Require modules like [Promise](https://eryn.io/roblox-lua-promise/) without having to make an HTTP get request.

What's planned ahead?
* Build submodules
  * This helps support project dependencies that slow down execution, like UI libraries.
  * For now, project dependencies can be loaded by using Rostruct internally, or by downloading them locally.
* Build from a project configuration file
  * Using configuration files can help customize the structure of your project.
* Fully implement [`init.meta.json`](https://rojo.space/docs/6.x/sync-details/#meta-files) properties
  * Currently, only basic properties like booleans and numbers can be set.

## Installation
### Option 1: Local files
* Download the latest `Rostruct.lua` file from the [Releases page](https://github.com/richie0866/Rostruct/releases/latest)
* Locate your executor's `workspace/` directory and insert `Rostruct.lua` into a folder named "rostruct"
* Rostruct is ready to use!
```lua
local Rostruct = loadfile("rostruct/Rostruct.lua")()
local Rostruct = loadstring(readfile("rostruct/Rostruct.lua"))()
```

### Option 2: From releases
* Locate the latest release of Rostruct from the [Releases page](https://github.com/richie0866/Rostruct/releases/latest)
* Copy the URL of the `Rostruct.lua` asset (ends with `/releases/download/TAGNAME/Rostruct.lua`)
* Use Rostruct in your code with `game.HttpGetAsync`!
```lua
local Rostruct = loadstring(game:HttpGetAsync(".../releases/download/TAGNAME/Rostruct.lua"))()
```

## Documentation
Documentation is available at the [Github pages site](https://richie0866.github.io/Rostruct).
