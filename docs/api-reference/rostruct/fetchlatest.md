# fetchLatest <span class="base-tag static-tag"></span> <span class="base-tag promise-tag"></span>

``` ts
function fetchLatest(owner: string, repo: string, asset?: string): Package
```

Constructs a new [`Package`](../package/properties.md) object from the latest **stable** GitHub Release, with a defined `fetchInfo` property.

When using this function, the asset gets saved to a local cache. However, this function will *always* make an HTTP request to get the latest release tag. Zip files are extracted using a modified version of the [zzlib](https://github.com/zerkman/zzlib) library.

Unlike [`Rostruct.fetch`](./fetch.md), this function does not load release drafts or prereleases.

The function returns a Promise object for convenience. Use the [`fetchLatestAsync`](#example-usage) function if you want to wait for the result instead.

!!! warning "Fetching from a large repository"

	When the `asset` field is undefined, the source code of the release will be downloaded.

	Because Rostruct uses a Lua zip library to extract `.zip` files, there may be performance issues when extracting large files.
	Prefer to [upload an asset](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository) for files you want to run in Rostruct.

---

## Parameters

* `#!ts owner: string` - The owner of the repository
* `#!ts repo: string` - The name of the repository
* `#!ts asset?: string | undefined` - Optional asset to download; If not specified, it downloads the source files

---

## Example usage

This example loads the latest stable release of [Roact](https://github.com/Roblox/roact):

=== "fetchLatest"

	``` lua
	local Roact = Rostruct.fetchLatest("Roblox", "roact")
		:andThen(function(package)
			if package.fetchInfo.updated then
				print("Upgraded to version " .. package.fetchInfo.tag)
			end

			package:build("src/", { Name = "Roact" })

			return package:require(package.tree.Roact)
		end)
		:catch(function(err)
			warn("Error loading Roact:", err)
		end)
		:expect()
	```

=== "fetchLatestAsync"

	``` lua
	local package = Rostruct.fetchLatestAsync("Roblox", "roact")

	if package.fetchInfo.updated then
		print("Upgraded to version " .. package.fetchInfo.tag)
	end

	package:build("src/", { Name = "Roact" })

	local Roact = package:requireAsync(package.tree.Roact)
	```
