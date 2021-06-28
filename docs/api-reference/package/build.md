# build

``` ts
function build(fileOrFolder?: string, props?: {[prop: string]: any}): Instance
```

Constructs and returns a new instance from a file or folder in the `root` directory. If `fileOrFolder` is not defined, it builds the root directory.

The function returns an Instance whose Parent is set to [`Package.tree`](properties.md#tree). The `props` parameter is applied to the instance *before* the Parent is set.

You can see the specifics on how files turn into Roblox objects on the [file conversion page](../file-conversion.md).

!!! tip
	Model files (`*.rbxm`, `*.rbxmx`) that contain LocalScript and ModuleScript instances act just like normal Rostruct scripts - but the [`_PATH`](../globals.md#_path) global points to the model file.

!!! caution
	Avoid building the root directory if it contains files not meant to be Roblox objects.

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
