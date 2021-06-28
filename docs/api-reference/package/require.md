# require <span class="base-tag promise-tag"></span>

``` ts
function require(module: ModuleScript): Promise<unknown>
```

Runs `module` if it has not been run already, and returns what the ModuleScript returned.

The `module` parameter must be a ModuleScript created with the [`build`](build.md) method.

The function returns a Promise object for convenience. Use the [`requireAsync`](#example-usage) function if you want to wait for the result instead.

---

## Parameters

* `#!ts module: ModuleScript` - The Rostruct module to load

---

## Example usage

=== "require"

	``` lua
	local package = Rostruct.open("PathTo/MyModule/")

	package:build("src/", {
		Name = "MyModule",
	})

	package:require(package.tree.MyModule)
		:andThen(function(MyModule)
			MyModule.DoSomething()
		end)
	```

=== "requireAsync"

	``` lua
	local package = Rostruct.open("PathTo/MyModule/")

	package:build("src/", {
		Name = "MyModule",
	})

	local MyModule = package:requireAsync(package.tree.MyModule)

	MyModule.DoSomething()
	```
