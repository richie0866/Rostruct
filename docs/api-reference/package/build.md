# build

``` ts
function build(fileOrFolder?: string, props?: {[prop: string]: any}): Instance
```

Constructs a new Instance from a file or folder in the `root` directory, with the properties `props`. Instances returned by this function can also be found in [`Package.tree`](properties.md#tree).

If `fileOrFolder` is a string, the function transforms `#!lua Package.root .. fileOrFolder`.

If `fileOrFolder` is `nil`, the function transforms the root directory.

You can see how files turn into Roblox objects on the [file conversion page](../file-conversion.md).

!!! tip
	Model files (`*.rbxm`, `*.rbxmx`) that contain LocalScript and ModuleScript instances act just like normal Rostruct scripts - but the [`_PATH`](../globals.md#_path) global points to the model file.

!!! caution
	Avoid building the root directory if it contains files Rostruct shouldn't use. It's good practice to store your source code in a specific folder in your project.

---

## Parameters

* `#!ts fileOrFolder?: string | undefined` - The file or folder to build; Defaults to the root directory
* `#!ts props?: {[prop: string]: any} | undefined` - A map of properties to apply to the instance

---

## Example usage

``` lua
local package = Rostruct.open("PathTo/MyProject/")

package:build("src/", {
	Name = "MyProject",
})

package:build("stringValue.txt", {
	Name = "MyString",
	Value = "Hi",
})

print(package.tree.MyString.Value) --> Hi
```
