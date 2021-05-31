<h1 align="center">Rostruct</h1>
<div align="center">
	<a href="https://github.com/richie0866/Rostruct/actions"><img src="https://github.com/richie0866/Rostruct/workflows/ESLint/badge.svg" alt="GitHub Actions ESLint Status" /></a>
	<a href="https://github.com/richie0866/Rostruct/releases"><img src="https://github.com/richie0866/Rostruct/workflows/Release/badge.svg" alt="GitHub Actions Release Status" /></a>
	<a href="https://richie0866.github.io/Rostruct"><img src="https://img.shields.io/badge/docs-website-blue.svg" alt="Rostruct Documentation" /></a>
</div>

<div align="center">
	A script execution library inspired by Rojo.
</div>

---

Rostruct is a script execution library, built in [TypeScript](https://roblox-ts.com/). It is designed to build and deploy projects and libraries in your favorite Roblox script executor.

Take advantage of modular programming to ensure a quality coding experience.

See the original concept [here](https://v3rmillion.net/showthread.php?tid=1081675).

## Introduction
Typically, running scripts in exploits is limited to single instances. As a result, most complex projects are stored in a single large, complicated file, often spanning thousands of lines.

In this way, exploit scripting contrasts scripting in Roblox Studio or Rojo, which allow scripts, modules, and objects to interact without resorting to HTTP requests and `game.GetObjects` calls to get external assets.

Rostruct works to cover the best of both worlds, bringing the modern [Rojo](https://rojo.space/docs/6.x/sync-details/) workflow to exploits.

## How it works
When building, deploying, or requiring a project, the process goes as follows:
1. First, Rostruct searches the target path for a `src/` or `lib/` directory to model the project after. Otherwise, the original path is used.
2. Then, files compatible with Rostruct (`lua`, `json`, `rbxm`, etc.) are converted to Roblox instances following the [file conversion model](https://richie0866.github.io/Rostruct).
3. If the project was deployed with `Rostruct.Deploy`, Rostruct executes every `LocalScript` in the instance tree. Each script has the `script` and `require` variables modified to mirror a Rojo & Roblox Studio workflow.
4. If the project was deployed with `Rostruct.Require`, and the target path leads to a module, it requires the project and stores the result.

## Features
* Promotes modular programming
  * Ensure quality readability, debugging, and maintainability in your projects.
* Github support
  * Install and deploy projects directly from Github releases.
* Builds `rbxm` models
  * Go `GetObjects`-free by loading models directly from the project files.
  * :warning: This feature requires `getcustomasset`!
* [Rojo](https://github.com/rojo-rbx/rojo#readme) support
  * Easily test your code in Roblox Studio before executing it.
* Loader library for lazy-loading modules
  * Require modules like [Promise](https://eryn.io/roblox-lua-promise/) without having to make an HTTP get request.

## Documentation
Documentation is available at the [Github pages site](https://richie0866.github.io/Rostruct).

## Installation
### Option 1: Local files
* Download the latest `Rostruct.lua` file from the [Releases page](https://github.com/richie0866/Rostruct/releases)
* Locate the scripting engine's `workspace/` directory and insert Rostruct into a folder named "rostruct"
* Rostruct is ready to use!
```lua
local Rostruct = loadfile("rostruct/Rostruct.lua")()
local Rostruct = loadstring(readfile("rostruct/Rostruct.lua"))()
```

### Option 2: From releases
* Locate the latest release of Rostruct from the [Releases page](https://github.com/richie0866/Rostruct/releases)
* Copy the URL of the `Rostruct.lua` asset (ends with `/releases/download/TAGNAME/Rostruct.lua`)
* Use Rostruct in your code with `game.HttpGetAsync`!
```lua
local Rostruct = loadstring(game:HttpGetAsync(".../releases/download/TAGNAME/Rostruct.lua"))()
```
