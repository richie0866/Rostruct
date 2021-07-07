# Publishing your project

Once you're ready to distribute your project, it's important to note that it should run automatically. Ideally, the end-user shouldn't do more than save a script.

Fortunately, Rostruct provides functionality to deploy your codebase through GitHub:

## Deploying from GitHub

The best way to publish your Rostruct project is by creating [GitHub Releases](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository) in a repository. Rostruct will save and version-check the releases for you.

You should write a **retriever** script that lets users run your project without any extra setup.  
The **retriever** handles the execution of your repo's latest GitHub Release. However, you'll need to load Rostruct to do that.

## Loading Rostruct

In the retriever, you can load Rostruct in two ways: with an HTTP request, or from Rostruct's source code. Each option has its pros and cons, so choose whichever one best fits your project.

### with HTTP GET <small>recommended</small> { data-toc-label="with HTTP GET" }

If you prefer a quick and concise way to load Rostruct, you can load it with an HTTP request. 

To do this, you should pick a release from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest), and copy the **tag version** to `TAG_VERSION_HERE` in this code:

```lua hl_lines="3"
local Rostruct = loadstring(game:HttpGetAsync(
	"https://github.com/richie0866/Rostruct/releases/download/"
	.. "TAG_VERSION_HERE"
	.. "/Rostruct.lua"
))()
```

This loads the Rostruct library by getting the source and executing it. You can now [deploy your project](#deployment).

### with source code

If you don't want to make an HTTP request, you can load Rostruct instantly by using the source code in your script. In other words, you'll be using Rostruct as an **internal module**.

To add Rostruct's source to your retriever, download the `Rostruct.lua` asset from your preferred release of Rostruct from the [GitHub Releases page](https://github.com/richie0866/Rostruct/releases/latest), and paste it into your retriever.

This file should end with `#!lua return Rostruct`. Since you're going to use Rostruct, all you have to do is remove that line!

Although this bloats up your file, unlike the first method, you can use Rostruct immediately.

## Running your project

After you've loaded Rostruct, use [`Rostruct.fetch`](../api-reference/rostruct/fetch.md) or [`Rostruct.fetchLatest`](../api-reference/rostruct/fetchlatest.md) to download and package the release files in your retriever.

### Deployment

You can deploy your project using Rostruct's `fetch` functions, which return a Promise that resolves with a new [`Package`](../api-reference/package/properties.md) object. It functions almost identically to using `Rostruct.open`, just with a Promise:

=== "Start"

	```lua
	-- Download the latest release to local files
	return Rostruct.fetchLatest("richie0866", "MidiPlayer")
		-- Then, build and start all scripts
		:andThen(function(package)
			package:build("src/")
			package:start()
			return package
		end)
		-- Finally, wait until the Promise is done
		:expect()
	```

=== "Require"

	```lua
	-- Download the latest release of Roact to local files
	return Rostruct.fetchLatest("Roblox", "roact")
		-- Then, build and require Roact
		:andThen(function(package)
			return package:require(
				package:build("src/", { Name = "Roact" })
			)
		end)
		-- Finally, wait until the Promise is done, and
		-- return the result of package:require
		:expect()
	```

Now, anyone with this script can deploy your project in a Roblox script executor. Remember to test your code!

You can simplify the script for end-user by saving the retriever in your repo and loading its source with `HttpGetAsync`:

### Distribution

Some users may prefer a short and concise way to use your project. To account for this, you should provide additional code that uses the `loadstring-HttpGet` pattern to run your project's retriever.

Loading your module through an HTTP request may seem counterproductive, but some developers may prefer it in a single-file project. So, your code should look something like this:

```lua
local Foo = loadstring(game:HttpGetAsync("LINK_TO_RAW_RETRIEVER"))()
```

`RAW_RETRIEVER_URL` should be replaced with a link to your retriever's raw contents. It may be in your best interest to [load Rostruct internally](#with-source-code) to avoid the extra HTTP request.
