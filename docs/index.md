# Home
Rostruct is a project execution library specializing in running Lua projects in a Roblox script executor. It transforms files into Roblox instances consistently with Rojo.

This documentation is a work in progress!

!!! note
	This documentation assumes some familiarity with Rojo. If you're new to development in an external IDE, [Rojo's documentation](https://rojo.space/docs/) provides an in-depth explanation and why you should do it.

## Rostruct
Rostruct is designed to complement a Rojo-based workflow, introducing script developers to a professional way to manage projects. You host your project files in your exploit's `workspace/` directory, letting you integrate professional tools into your workflow.

### Effortlessly load dependencies
With functions to [download Github releases](api-reference.md#downloadrelease), you can easily require libraries as intricate as [Roact](https://github.com/Roblox/roact/) and use them to their full extent in your projects.

### Act like it's Roblox Studio
Transforming files into Roblox instances means that your code will run as if it were a Script object. Your code can interact with your codebase as if it's Roblox Studio, using the `script` and `require` globals to access other parts of your project.

### Curb loading times
With Rostruct, you can include assets as `rbxm` model files directly in your codebase. They get turned into Roblox objects with the rest of your files, so they're readily available during runtime.

### Built for ambitious projects
Rostruct is an **execution library** that executes multiple files in conjunction - this allows the developer tons of freedom to create projects like UI libraries, script hubs, explorers - you name it - with little to no restrictions.

### Test at any time
If your project is designed with Rojo for Roblox Studio, you can develop and test your projects, regardless of whether you have access to an unpatched script executor.

### Recommended tools
Rostruct can (and should!) be paired with professional-grade tools like:

* [Rojo](https://rojo.space/docs/) - a project management tool designed to get professional resources in the hands of Roblox developers
* [Roblox LSP](https://devforum.roblox.com/t/roblox-lsp-full-intellisense-for-roblox-and-luau/717745) - full intellisense for Roblox and Luau in VSCode
* [Selene for VSCode](https://marketplace.visualstudio.com/items?itemName=Kampfkarren.selene-vscode) - a blazing-fast modern Lua linter
