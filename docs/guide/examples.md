# Examples

## Get assets

A useful pattern is to keep all assets and dependencies within your project for immediate access. Let's say a project is structured like such:

* MyProject/
	* Runtime.client.lua (LocalScript)
	* Controllers/
		* MyController.lua (ModuleScript)
	* Assets/
		* Character.rbxm (Model)

We can write `MyController.lua` as such:

```lua
local myProject = script:FindFirstAncestor("MyProject")

local character = myProject.Assets.Character
...
return MyController
```

!!! tip
	The same practice can be done to retrieve folders, modules, or any other instance in your project.
