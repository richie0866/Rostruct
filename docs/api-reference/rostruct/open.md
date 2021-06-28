# open <span class="base-tag static-tag"></span>

``` ts
function open(rootDirectory: string): Package
```

Constructs a new [`Package`](../package/properties.md) object from the given folder.

---

## Parameters

* `#!ts rootDirectory: string` - A path to the Roblox project

---

## Example usage

``` lua
local package = Rostruct.open("projects/MyProject/")

package:build("src/", { Name = "MyProject" })

package:start()
```
