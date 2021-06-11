# Publishing your project

Once you're ready to distribute your project, you must consider how users can deploy your code. Fortunately, Rostruct provides functions to download and deploy your codebase through GitHub automatically.

## GitHub Releases

The best way to publish your Rostruct project is by creating a [GitHub Release](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository). Rostruct provides functions to download, cache, and deploy your project from a GitHub release to the end-user.

Using GitHub Releases, you can use a **deploy script** to make your project deploy for anyone, with no manual installation necessary. Your **deploy script** is what downloads and deploys the latest release of your **source code**. This script typically doesn't change, other than to update Rostruct.

However, you'll need to load Rostruct in your deploy script without making it complicated for the user.

## Loading Rostruct

### with TS <small>recommended</small> { data-toc-label="with TS" }

!!! note
	Because Rostruct is written in TypeScript for Roblox, it uses the `TS` module internally to simulate runtime. This is black magic that should be taken at face value when viewing the code below. `TS.initialize("init")` essentially requires Rostruct straight from the source.

A fast, but hefty way to use Rostruct in your **deploy script** is to load Rostruct internally. Thus, your code will not use an HTTP request to load Rostruct, nor will it load it from a file; you include Rostruct's complete source inside of your script.

To add Rostruct's source to your deploy script, you first download the `Rostruct.lua` asset from the latest release of Rostruct from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest).

The file will end with `#!lua return TS.initialize("init")`. This line of code essentially loads Rostruct as a module and returns it when being called with `#!lua loadstring()` or `#!lua loadfile()`.

Because you will be using Rostruct from the source, replace `#!lua return TS.initialize("init")` with the following code:

```lua
local Rostruct = TS.initialize("init")
```

This loads the Rostruct library directly from the source code included above. You can now [use Rostruct in your deploy script](#deployment).

### with HTTP GET

If you prefer a quick, concise way to load Rostruct, you can load it in your **deploy script** using an HTTP request. 

To load Rostruct with an HTTP request, you should first locate the release you'd like to use from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest). Once you've done that, you can copy the version to the left of the title, and paste it as `TAG_VERSION_HERE` in this code:

```lua
local VERSION = "TAG_VERSION_HERE"
local URL = "https://github.com/richie0866/Rostruct/releases/download/%s/Rostruct.lua"
local Rostruct = loadstring(game:HttpGetAsync(string.format(URL, VERSION)))()
```

This loads the Rostruct library by executing the source code from the given version.

## Deployment

After you've loaded Rostruct in your deploy script, use [`Rostruct.DownloadLatestRelease`](../reference/functions.md#downloadlatestrelease) to download your project's most recent GitHub Release files. This function automatically caches, updates, and version-checks your releases, so no further configuration is necessary.

!!! note
	Prereleases and drafts do not count towards the latest release, but can be downloaded using [`Rostruct.DownloadRelease`](../reference/functions.md#downloadrelease).

=== "Deploy"

	```lua
	-- Download the latest release to local files:
	local download = Rostruct.DownloadLatestRelease(
		"richie0866",
		"MidiPlayer"
	):expect()

	-- Deploy and set up:
	local project = Rostruct.Deploy(download.Location .. "src/")
	project.Instance.Name = "MidiPlayer"
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

	-- Require:
	local Roact = project.Module:expect()
	```

Whenever a new GitHub Release is available for your project, the **deploy script** will handle installation and deployment for you. You can then use this script for public or commercial use to execute your project.
