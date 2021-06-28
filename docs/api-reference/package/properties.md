# Package

A **Package** is an object that represents a Roblox project. It exposes most of Rostruct's project building API and handles Lua script runtime.

## Properties

Properties are public fields exposed by a `Package` object.

For example, you can access `Package.tree` like this:

``` lua
local package = Rostruct.open("MyProject")

print(package.tree) --> Tree
```

---

### `tree` <span class="base-tag read-only-tag"></span>

``` ts
readonly tree: Folder
```

A Folder object containing all objects returned by the `Package.build` method.

This property helps simplify Promise usage, since you don't need to store the result of the `Package.build` method to require a module.

---

### `root` <span class="base-tag read-only-tag"></span>

``` ts
readonly root: string
```

A reference to the root directory of the project, which was passed into the `Rostruct.open` function.

The value should *always* end with a forward slash!

---

### `fetchInfo` <span class="base-tag read-only-tag"></span>

``` ts
readonly fetchInfo?: FetchInfo | undefined
```

An object that stores information about the last `Rostruct.fetch` or `Rostruct.fetchLatest` operation.

See the [FetchInfo](../types.md#fetchinfo) documentation for more info on how it's structured.
