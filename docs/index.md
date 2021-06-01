# Home
Rostruct is a project deployment library specializing in running Lua projects in a Roblox script executor. It builds your project as Roblox objects nearly identical to Rojo's.

This documentation is based on Rojo's documentation, but is a work in progress.

!!! info
	This documentation assumes some familiarity with Rojo. If you're new to using external project files, [Rojo's documentation](https://rojo.space/docs/) is a good introduction.

## Rostruct
Rostruct is designed to complement a Rojo-based workflow, introducing script developers to a professional way to manage projects. You host your project files in your exploit's `workspace` directory, gaining offline access to your project and the ability to integrate professional tools into your codebase.

### Effortlessly load dependencies
With features like fetching Github repositories, you can easily require libraries as intricate as [Roact](https://github.com/Roblox/roact/) and use them to their full extent in your projects.

### Curb loading times
With Rostruct, you can include assets as `rbxm` model files directly in your project files, turning them into Roblox objects before script runtime, so they're readily available.

### Built for ambitious projects
Rostruct is a **project deployment library** that only *executes* your files - this allows the developer more freedom to create projects from UI libraries to script hubs to explorers with little to no restrictions.

### Test during exploit downtime
If your project isn't too exploit-oriented and functions in Roblox Studio, you can continue developing your projects using Rojo.

### Use with other tools
Rostruct can (and should!) be paired with professional-grade tools like:

* [Rojo](https://rojo.space/docs/) - a project management tool designed to get professional resources in the hands of Roblox developers
* [Roblox LSP](https://devforum.roblox.com/t/roblox-lsp-full-intellisense-for-roblox-and-luau/717745) - full intellisense for Roblox and Luau in VSCode
* [Selene for VSCode](https://marketplace.visualstudio.com/items?itemName=Kampfkarren.selene-vscode) - a blazing-fast modern Lua linter
