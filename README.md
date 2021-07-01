<div align="center">
	<a href="https://richie0866.github.io/Rostruct"><img src="img/Rostruct.svg" alt="Rostruct logo" width="256"></img></a>
	<h1>Rostruct</h1>
	<a href="https://github.com/richie0866/Rostruct/actions/workflows/release.yml"><img src="https://github.com/richie0866/Rostruct/actions/workflows/release.yml/badge.svg" alt="GitHub Actions Release Status" /></a>
	<a href="https://github.com/richie0866/Rostruct/actions/workflows/eslint.yml"><img src="https://github.com/richie0866/Rostruct/actions/workflows/eslint.yml/badge.svg" alt="GitHub Actions ESLint Status" /></a>
	<a href="https://github.com/richie0866/Rostruct/releases/latest"><img src="https://img.shields.io/github/v/release/richie0866/Rostruct?include_prereleases" alt="Latest Release" /></a>
	<a href="https://richie0866.github.io/Rostruct"><img src="https://img.shields.io/badge/docs-website-blue.svg" alt="Rostruct Documentation" /></a>
	<br>
	A modern exploiting solution, built for Roblox and Rojo
</div>

---

**Rostruct** is a script execution tool that runs Roblox projects in a Roblox script executor. This solution substitutes frameworks that use `HttpGetAsync` and `GetObjects` to load and run code. You can use it with [Rojo](https://rojo.space/) to take advantage of game development tools in your exploits.

Whether you're familiar with Rojo, want easy access to assets, or need to get external dependencies, you might enjoy using this library. 

See the original concept [here](https://v3rmillion.net/showthread.php?tid=1081675).

## Why Rostruct?

When it comes to exploiting, projects are developed and maintained within a single file. However, scripts that get too large become detrimental to your workflow. Debugging, management, and working in teams becomes more difficult as the project continues.

In contrast, if you've ever made a Rojo project, the files in your codebase can run in Roblox. Taking this **modular approach** to exploiting can significantly improve the development experience.

Rostruct's design complements a Rojo-based workflow, introducing script developers to a professional way to manage projects.

## Usage

Documentation is available at the [GitHub Pages site](https://richie0866.github.io/Rostruct).

## How it works

<img src="img/example-vscode-and-roblox.png" align="right"
     alt="Rostruct Build Example" height="300">

Rostruct builds instances following a [file conversion model](https://richie0866.github.io/Rostruct/reference/file-conversion/). Files compatible with Rostruct (`lua`, `json`, `rbxm`, etc.) are turned into Roblox instances.

Scripts have preset `script` and `require` globals to mirror LocalScript and ModuleScript objects. This way, runtime is similar between Roblox Studio and script executors.

## Features

* Promotes modular programming
  * Keep your codebase readable and maintainable.

* Instance-based execution
  * Write your code like it's Roblox Studio.

* GitHub support
  * Build packages from GitHub releases, allowing users to execute your code without manually downloading it.

* Builds `rbxm` models
  * Go `GetObjects`-free by including assets in your project files.

* Designed for [Rojo](https://github.com/rojo-rbx/rojo#readme)
  * Test your code in Roblox Studio without an exploit.

## Contributing

If there are any features you think are missing, feel free to [open an issue](https://github.com/richie0866/Rostruct/issues)!

If you'd like to contribute, [fork Rostruct](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and submit a [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) when you're ready.

### Setup

1. Run `npm install` to install all dependencies used by this project.
2. Then, run `rbxtsc -w` to start building the TypeScript source to Lua files as you make changes.

### Testing

3. Run `npm run build:prod` in a Git Bash terminal to generate an output file. Make sure the `out/` directory is up-to-date with `rbxtsc`!
4. The command should create a `Rostruct.lua` file in the root directory. At the end of the script, you'll find this code:
   
   ```lua
   return TS.initialize("init")
   ```
   Replace it with this code to use Rostruct underneath it:
   
   ```lua
   local Rostruct = TS.initialize("init")
   ```

## License

Rostruct is available under the MIT license. See [LICENSE](https://github.com/richie0866/Rostruct/blob/main/LICENSE) for more details.
