# Static Functions

## <span class="code">Build</span>&nbsp; <span class="base-tag static-tag"></span>

<span class="code">
	Rostruct<span class="symbol">.</span><span class="keyword">Build</span><span class="symbol">(</span>location<span class="symbol">:</span>
	<span class="type">string</span><span class="symbol">,</span>
	parent<span class="symbol">?:</span>
	<span class="type">Instance</span><span class="symbol">)</span>
	<span class="keyword">=></span>
	[<span class="interface"><u>BuildResult</u></span>](./types.md#buildresult)
</span>

Transforms files found at `location` into Roblox instances. This process is almost identical to syncing Rojo to Roblox Studio, with [certain features omitted](./file-conversion.md).

This function **does not** sync files, as Rostruct is purely an execution tool. `Rostruct.Build` creates instances and sets up Lua files for execution.

**Parameters**

| Name                               | Type                               | Required         |
| ---------------------------------- | ---------------------------------- | ---------------- |
| <span class="code">location</span> | <span class="type">string</span>   | :material-check: |
| <span class="code">parent</span>   | <span class="type">Instance</span> | :material-close: |

**Returns**

| Type                                                                        |
| --------------------------------------------------------------------------- |
| [<span class="interface"><u>BuildResult</u></span>](./types.md#buildresult) |

---

## <span class="code">Deploy</span>&nbsp; <span class="base-tag static-tag"></span>

<span class="code">
	Rostruct<span class="symbol">.</span><span class="keyword">Deploy</span><span class="symbol">(</span>location<span class="symbol">:</span>
	<span class="type">string</span><span class="symbol">,</span>
	parent<span class="symbol">?:</span>
	<span class="type">Instance</span><span class="symbol">)</span>
	<span class="keyword">=></span>
	[<span class="interface"><u>BuildResult</u></span>](./types.md#buildresult)
</span>

Runs every LocalScript object in the Instance created by [`Rostruct.Build`](#build). It adds an additional field, `RuntimeWorker`, to the [`BuildResult`](./types.md#buildresult) object.

`RuntimeWorker` is a Promise which resolves with every LocalScript this function executed, only after every script finishes running on the main thread.

!!! warning
	`RuntimeWorker` will automatically time out after 30 seconds of suspended execution; Avoid making a script yield the main thread!

**Example use** 

```lua
local project = Rostruct.Deploy("Projects/Hydroxide/src/")

-- Waits for all scripts to finish executing:
project.RuntimeWorker:andThen(function(scripts)
    print("Amount of scripts executed: " .. #scripts)
    for _, obj in ipairs(scripts) do
        print("Script " .. obj.Name .. " executed!")
    end
end)
```

**Parameters**

| Name                               | Type                               | Required         |
| ---------------------------------- | ---------------------------------- | ---------------- |
| <span class="code">location</span> | <span class="type">string</span>   | :material-check: |
| <span class="code">parent</span>   | <span class="type">Instance</span> | :material-close: |

**Returns**

| Type                                                                        | Note                       |
| --------------------------------------------------------------------------- | -------------------------- |
| [<span class="interface"><u>BuildResult</u></span>](./types.md#buildresult) | Adds field `RuntimeWorker` |

---

## <span class="code">Require</span>&nbsp; <span class="base-tag static-tag"></span>

<span class="code">
	Rostruct<span class="symbol">.</span><span class="keyword">Require</span><span class="symbol">(</span>location<span class="symbol">:</span>
	<span class="type">string</span><span class="symbol">,</span>
	parent<span class="symbol">?:</span>
	<span class="type">Instance</span><span class="symbol">)</span>
	<span class="keyword">=></span>
	[<span class="interface"><u>BuildResult</u></span>](./types.md#buildresult)
</span>

If the project is a **module**, it executes it and saves the result to an additional field, `Module`, in the [`BuildResult`](./types.md#buildresult) object.

`Module` is a Promise which resolves with exactly what the root ModuleScript returned.

!!! warning
	Calling `Rostruct.Require()` on a directory with no `init.lua` file in it will throw an error. When using this function, you should set up the project folder to transform into a ModuleScript.
	
	See the [execution model page](../getting-started/execution-model.md#requiring-your-project) for how to do this, and [Rojo's sync details](https://rojo.space/docs/6.x/sync-details/#scripts) for a detailed explanation.

**Example use** 

```lua
local project = Rostruct.Require("Projects/Roact/src/")
project.Instance.Name = "Roact"

-- Load the Roact module:
local Roact = project.Module:expect()
```

**Parameters**

| Name                               | Type                               | Required         |
| ---------------------------------- | ---------------------------------- | ---------------- |
| <span class="code">location</span> | <span class="type">string</span>   | :material-check: |
| <span class="code">parent</span>   | <span class="type">Instance</span> | :material-close: |

**Returns**

| Type                                                                        | Note                                    |
| --------------------------------------------------------------------------- | --------------------------------------- |
| [<span class="interface"><u>BuildResult</u></span>](./types.md#buildresult) | Adds field `RuntimeWorker` and `Module` |

---

## <span class="code">DownloadRelease</span>&nbsp; <span class="base-tag static-tag"></span>

<span class="code">
	Rostruct<span class="symbol">.</span><span class="keyword">DownloadRelease</span><span class="symbol">(</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;owner<span class="symbol">:</span> <span class="type">string</span><span class="symbol">,</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;repo<span class="symbol">:</span> <span class="type">string</span><span class="symbol">,</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;tag<span class="symbol">:</span> <span class="type">string</span><span class="symbol">,</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;asset<span class="symbol">?:</span> <span class="type">string</span>  
	<span class="symbol">) </span><span class="keyword">=></span>
	<span class="interface">Promise</span>&lt;[<span class="interface"><u>DownloadResult</u></span>](./types.md#downloadresult)&gt;
</span>

Downloads and saves a GitHub release of the `repo` owned by `owner`. The `tag` parameter refers to the **tag version**. You set the tag version while [making a release](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository). If `asset` is not specified, it will download the source code of the release.

??? tip "How do I get the tag version?"
	![image](../assets/images/github-tag-version.png){ align=right width=512 }

	The tag version is **not** the name of the release.
	
	You can find the tag version to the left of the release name:

Downloading a release saves it to a folder in the cache. Attempting to download an already cached release will make no HTTP requests, and the function will not try to redownload it.

The location of the cached folder is in the [`DownloadResult`](./types.md#downloadresult) object.

!!! info
	This function automatically extracts `.zip` files to a folder in the cache. If you'd like to download a specific group of files from your release, compress them to a `.zip` file and add it as a file in your release. How to add files to your release can be found [here](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository).

**Example use** 

```lua
-- Downloads the source code of Roact v1.4.0
-- and waits for the Promise to finish:
local download = Rostruct.DownloadRelease("Roblox", "roact", "v1.4.0"):expect()

-- Output something if it's a new download:
if download.Updated then
	print("Roact v1.4.0 installed!")
end

-- Requires Roact:
local Roact = Rostruct.Require(download.Location .. "src/").Module:expect()
```

If you'd like to load a specific asset from your release, you can write your code as such:

```lua
-- Downloads the model file for Roact v1.4.0:
Rostruct.DownloadRelease("Roblox", "roact", "v1.4.0", "Roact.rbxm")
```

**Parameters**

| Name                            | Type                             | Required         |
| ------------------------------- | -------------------------------- | ---------------- |
| <span class="code">owner</span> | <span class="type">string</span> | :material-check: |
| <span class="code">repo</span>  | <span class="type">string</span> | :material-check: |
| <span class="code">tag</span>   | <span class="type">string</span> | :material-check: |
| <span class="code">asset</span> | <span class="type">string</span> | :material-close: |

**Returns**

| Type                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="code"><span class="interface">Promise</span>&lt;[<span class="interface"><u>DownloadResult</u></span>](./types.md#downloadresult)&gt;</span> |

---

## <span class="code">DownloadLatestRelease</span>&nbsp; <span class="base-tag static-tag"></span>

<span class="code">
	Rostruct<span class="symbol">.</span><span class="keyword">DownloadLatestRelease</span><span class="symbol">(</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;owner<span class="symbol">:</span> <span class="type">string</span><span class="symbol">,</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;repo<span class="symbol">:</span> <span class="type">string</span><span class="symbol">,</span>  
	&nbsp;&nbsp;&nbsp;&nbsp;asset<span class="symbol">?:</span> <span class="type">string</span>  
	<span class="symbol">) </span><span class="keyword">=></span>
	<span class="interface">Promise</span>&lt;[<span class="interface"><u>DownloadResult</u></span>](./types.md#downloadresult)&gt;
</span>

Downloads and saves the latest GitHub release of the `repo` owned by `owner`. If `asset` is not specified, it will download the source code of the release.

This functions identically to [`Rostruct.DownloadRelease`](#downloadrelease), except there is no `tag` parameter. This function will **always** make an HTTP GET request to get the latest release tag of the repository.

If a new release is available, it will clear the cached data and download the new release. The [`DownloadResult`](./types.md#downloadresult) promise is only resolved *after* this operation completes.

**Example use** 

```lua
-- Downloads the latest source code of Roact
-- and waits for the Promise to finish:
local download = Rostruct.DownloadLatestRelease("Roblox", "roact"):expect()

-- Output something if a new release was downloaded:
if download.Updated then
	print("Roact has been updated to " .. download.Tag .. "!")
end

-- Requires Roact:
local build = Rostruct.Require(download.Location .. "src/")
build.Instance.Name = "Roact"

local Roact = build.Module:expect()
```

**Parameters**

| Name                            | Type                             | Required         |
| ------------------------------- | -------------------------------- | ---------------- |
| <span class="code">owner</span> | <span class="type">string</span> | :material-check: |
| <span class="code">repo</span>  | <span class="type">string</span> | :material-check: |
| <span class="code">asset</span> | <span class="type">string</span> | :material-close: |

**Returns**

| Type                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="code"><span class="interface">Promise</span>&lt;[<span class="interface"><u>DownloadResult</u></span>](./types.md#downloadresult)&gt;</span> |

---

## <span class="code">ClearReleaseCache</span>&nbsp; <span class="base-tag static-tag"></span> <span class="base-tag debug-tag"></span>

<span class="code">
	Rostruct<span class="symbol">.</span><span class="keyword">ClearReleaseCache</span><span class="symbol">() <span class="keyword">=></span>
	<span class="symbol"><u>void</u></span>
</span>

Clears the Rostruct release cache. [`DownloadRelease`](#downloadrelease) and [`DownloadLatestRelease`](#downloadrelease) calls following this operation will need to redownload and cache the releases again.
