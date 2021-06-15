<div align="center">
	<a href="https://richie0866.github.io/Rostruct"><img src="img/Rostruct.svg" alt="Rostruct logo" width="256"></img></a>
	<h1>Rostruct</h1>
	A modern exploiting solution, built for Roblox and Rojo
	<br><br>
	<a href="https://github.com/richie0866/Rostruct/actions/workflows/release.yml"><img src="https://github.com/richie0866/Rostruct/actions/workflows/release.yml/badge.svg" alt="GitHub Actions Release Status" /></a>
	<a href="https://github.com/richie0866/Rostruct/actions/workflows/eslint.yml"><img src="https://github.com/richie0866/Rostruct/actions/workflows/eslint.yml/badge.svg" alt="GitHub Actions ESLint Status" /></a>
	<a href="https://github.com/richie0866/Rostruct/releases/latest"><img src="https://img.shields.io/github/v/release/richie0866/Rostruct?include_prereleases" alt="Latest Release" /></a>
	<a href="https://richie0866.github.io/Rostruct"><img src="https://img.shields.io/badge/docs-website-blue.svg" alt="Rostruct Documentation" /></a>
</div>

---

**Rostruct** is a script execution library that runs your Lua projects in a Roblox script executor. This library is a substitute for frameworks that use `HttpGetAsync` and `GetObjects` to run code. You can use it with [Rojo](https://rojo.space/) to ensure a streamlined development experience.

Whether you're familiar with Rojo, dislike loading assets during runtime, or want to import libraries, you might enjoy using this library. 

See the original concept [here](https://v3rmillion.net/showthread.php?tid=1081675).

## Why Rostruct?
When it comes to exploiting, developers often write their projects as a single Lua file. However, large, messy scripts are detrimental to your workflow, as they make debugging, management, and working in teams difficult.

In contrast, if you've ever used Rojo with Roblox Studio, you're able to distribute your codebase between separate, specialized files. Taking a **modular approach** to development can improve how you plan, design, and maintain your codebase.

Rostruct's design complements a Rojo-based workflow, introducing script developers to a professional way to manage projects. Host your project files in your exploit's `workspace/` directory, allowing for a more professional developing environment.

## Documentation
Documentation is available at the [GitHub Pages site](https://richie0866.github.io/Rostruct).

## How it works
How does Rostruct build instances?

<img src="img/example-vscode-and-roblox.png" align="right"
     alt="Rostruct Build Example" height="300">

* Rostruct builds instances following a [file conversion model](https://richie0866.github.io/Rostruct/reference/file-conversion/). Files compatible with Rostruct (`lua`, `json`, `rbxm`, etc.) are turned into Roblox instances.

What does deploying a project do?

* Projects can be deployed or required; If you deployed the project, Rostruct executes every `LocalScript` in the instance tree.
* If you required the project, and the project results in a `ModuleScript` (as seen in the image), it requires the module and stores the result.

Every script has preset `script` and `require` variables to closely mirror a Rojo & Roblox Studio workflow. This way, scripts in your project don't need any extra configuration to require modules and get assets.

## Features
* Promotes modular programming
  * Ensure quality readability, debugging, and maintainability in your projects.

* Instance-based execution
  * Run your projects in an environment that closely mirrors a Rojo & Roblox Studio workflow.

* GitHub support
  * Install and deploy projects directly from GitHub releases, allowing users to execute your code without manually downloading it.

* Builds `rbxm` models
  * Go `GetObjects`-free by loading models directly from your project files.

* Designed with [Rojo](https://github.com/rojo-rbx/rojo#readme) in mind
  * Easily test your code in Roblox Studio before executing it.

What's planned for the future?
* Project configuration file
  * Using configuration files can help customize the structure of your project. You decide where to build your files, and Rostruct handles it for you. 

* Fully implement [`init.meta.json`](https://rojo.space/docs/6.x/sync-details/#meta-files) properties
  * Currently, only primitive types like `boolean` and `number` can be set.

## Installation
You should [read the installation page](https://richie0866.github.io/Rostruct/getting-started/installation/) to load the Rostruct library for personal use. If you'd like to release your project, refer to [the project publishing page](https://richie0866.github.io/Rostruct/getting-started/publishing-your-project/).
