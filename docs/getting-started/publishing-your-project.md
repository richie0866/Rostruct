# Publishing your project

Once you're ready to distribute your project, it's important to note that a manual setup should not be required by the user. They should only have to paste a script to run your project.

Fortunately, Rostruct provides functionality to download and deploy your codebase through GitHub in one go:

## Deploying from GitHub

The best way to publish your Rostruct project is by creating a [GitHub Release](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository). With Rostruct, you can download, cache, and version-check releases, all in a single function.

Ideally, deploying your project should be effortless. Writing a **deploy script** grants users the ability to deploy your project without any extra setup. This script handles the execution of your project's latest **GitHub Release**. However, you'll need to load Rostruct to do that.

## Loading Rostruct

The **deploy script** can load Rostruct internally in two ways: through an HTTP request or Rostruct's source code. Each option has its pros and cons, so choose whichever one best fits your project.

### with HTTP GET <small>recommended</small> { data-toc-label="with HTTP GET" }

If you prefer a quick, concise way to load Rostruct, you can load through an HTTP request. 

To load Rostruct with an HTTP request, you should first locate your preferred release from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest). Once you've done that, you can copy the version to the left of the title, and paste it as `TAG_VERSION_HERE` in this code:

```lua
local VERSION = "TAG_VERSION_HERE"
local URL = "https://github.com/richie0866/Rostruct/releases/download/%s/Rostruct.lua"
local Rostruct = loadstring(game:HttpGetAsync(string.format(URL, VERSION)))()
```

This loads the Rostruct library by downloading the source and executing it. You can now [deploy your project](#deployment).

### with the source

If making an HTTP request is not your style, you can decrease loading time by running the source code. In other words, you'll be using Rostruct as an **internal module**.

To add Rostruct's source to your deploy script, download the `Rostruct.lua` asset from your preferred release of Rostruct from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest).

This file ends with `#!lua return TS.initialize("init")`, which is kind of like calling `#!lua require()` on a ModuleScript, and then returning the result.

??? question "What is `TS`?"
	Because Rostruct uses TypeScript for Roblox, it uses the `TS` module to simulate its runtime. Essentially, running `#!lua TS.initialize("init")` requires Rostruct from the source code.

Because you will be using Rostruct from the source, replace `#!lua return TS.initialize("init")` with the following code:

```lua
local Rostruct = TS.initialize("init")
```

Although your deploy script is much longer, you now have immediate access to Rostruct, with no yielding required.

## Running your project

After you've loaded Rostruct in your deploy script, use [`Rostruct.DownloadLatestRelease`](../reference/functions.md#downloadlatestrelease) to download your project's most recent GitHub Release files. This function automatically caches, updates, and version-checks your releases, to ensure a hassle-free user experience.

!!! note
	Drafts and prereleases are ignored in `DownloadLatestRelease`, but can be downloaded using [`Rostruct.DownloadRelease`](../reference/functions.md#downloadrelease).

### Deployment

Rostruct's GitHub Release functions return a Promise that resolves with a useful `DownloadResult` object. Using the result, you can get the location of the release in the cache, and use Rostruct to deploy or require it:

=== "Deploy"

	```lua
	-- Download the latest release to local files:
	local download = Rostruct.DownloadLatestRelease(
		"richie0866",
		"MidiPlayer"
	):expect()

	-- Deploy and set up:
	local project = Rostruct.Deploy(download.Location .. "src/")
	```

=== "Require"

	```lua
	-- Download the latest release to local files:
	local download = Rostruct.DownloadLatestRelease(
		"Roblox",
		"roact"
	):expect()

	-- Set up:
	local project = Rostruct.Require(download.Location .. "src/")
	project.Instance.Name = "Roact"

	-- Require and return:
	return project.Module:expect()
	```

Remember to test your deploy script! Anyone with this script can deploy your project in their script executor. However, this **should not** be the only code you distribute to the end-user.

### Distribution

Some users may want to use your resource without using the entire deploy script. To account for this, you should encourage them to use `loadstring-HttpGet` syntax to load your module.

Loading your module through an HTTP request may seem counterproductive, but it's much easier to manage when working with a single-file project. Thus, you should provide additional code that looks something like this:

=== "Deploy"

	```lua
	loadstring(game:HttpGetAsync( RAW_DEPLOY_SCRIPT_URL ))()
	```

=== "Require"

	```lua
	local MyModule = loadstring(game:HttpGetAsync( RAW_DEPLOY_SCRIPT_URL ))()
	```

`RAW_DEPLOY_SCRIPT_URL` should be replaced with a link to your **deploy script**'s raw contents. It may be in your best interest to include Rostruct's source [in your deploy script](#with-source) to avoid excess HTTP requests when loading your module.
