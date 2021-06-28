# fetch <span class="base-tag static-tag"></span> <span class="base-tag promise-tag"></span>

``` ts
function fetch(owner: string, repo: string, tag: string, asset?: string): Promise<Package>
```

Constructs a new [`Package`](../package/properties.md) object from the GitHub Release, with a defined `fetchInfo` property.

When using this function, the asset gets saved to a local cache, which makes future `fetch` calls for the same asset resolve right away. Zip files are extracted using a modified version of the [zzlib](https://github.com/zerkman/zzlib) library.

The function returns a Promise object for convenience. Use the [`fetchAsync`](#example-usage) function if you want to wait for the result instead.

!!! warning "Fetching from a large repository"

	When the `asset` field is undefined, the source code of the release will be downloaded.

	Because Rostruct uses a Lua zip library to extract `.zip` files, there may be performance issues when extracting large files.
	Prefer to [upload an asset](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository) for files you want to run in Rostruct.

---

## Parameters

* `#!ts owner: string` - The owner of the repository
* `#!ts repo: string` - The name of the repository
* `#!ts tag: string` - The tag version to download
* `#!ts asset?: string | undefined` - Optional asset to download; If not specified, it downloads the source files

---

## Example usage

This example loads [Roact](https://github.com/Roblox/roact) v1.4.0:

=== "fetch"

	``` lua
	local Roact = Rostruct.fetch("Roblox", "roact", "v1.4.0")
		:andThen(function(package)
			if package.fetchInfo.updated then
				print("First time installation!")
			end

			package:build("src/", { Name = "Roact" })

			return package:require(package.tree.Roact)
		end)
		:catch(function(err)
			warn("Error loading Roact:", err)
		end)
		:expect()
	```

=== "fetchAsync"

	``` lua
	local package = Rostruct.fetchAsync("Roblox", "roact", "v1.4.0")

	if package.fetchInfo.updated then
		print("First time installation!")
	end

	package:build("src/", { Name = "Roact" })

	local Roact = package:requireAsync(package.tree.Roact)
	```
