# clearCache <span class="base-tag static-tag"></span> <span class="base-tag debug-tag"></span>

``` ts
function clearCache()
```

Clears the Rostruct GitHub Release cache that is used by the `fetch` and `fetchLatest` functions.

!!! danger "Don't use this in your projects!"
	This function should be used by the end user for troubleshooting only.

---

## Example usage

Because the cache is cleared, this code always redownloads Roact:

``` lua
Rostruct.clearCache()

local package = Rostruct.fetch("Roblox", "roact", "v1.4.0")
```
