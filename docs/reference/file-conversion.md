# File conversion

???+ danger "Important"

	Because Rostruct is for Roblox script execution, and Rojo is for the command-line, some key differences exist in functionality.
	
	Please exercise caution when using Rostruct with Rojo, and keep track of Rojo updates!

	??? missing "Not supported"

		* Rojo project files
			* Project files structure your codebase around the `game` object, which would expose your project to the client.

	??? check "Extra functionality"

		* `.rbxm` and `.rbxmx` files are fully supported, but [Binary models](https://rojo.space/docs/6.x/sync-details/#models) are buggy in Rojo

	??? bug "Known issues"

		* `*.model.json` files do not support Rojo's custom properties like `Instance.Tags` and `LocalizationTable.Content`.
		* `*.meta.json` files infer property types differently than Rojo meta files.

Rostruct file conversion mirrors [Rojo's sync details](https://rojo.space/docs/6.x/sync-details/).

Concepts on the table below will redirect you to their respective Rojo pages.

## Overview

| Concept                                                                | File Name      |
| ---------------------------------------------------------------------- | -------------- |
| [Folders](https://rojo.space/docs/6.x/sync-details/#folders)           | any directory  |
| Server [scripts](https://rojo.space/docs/6.x/sync-details/#scripts)    | `*.server.lua` |
| Client [scripts](https://rojo.space/docs/6.x/sync-details/#scripts)    | `*.client.lua` |
| Module [scripts](https://rojo.space/docs/6.x/sync-details/#scripts)    | `*.lua`        |
| XML [models](https://rojo.space/docs/6.x/sync-details/#models)         | `*.rbxmx`      |
| Binary [models](https://rojo.space/docs/6.x/sync-details/#models)      | `*.rbxm`       |
| [Plain text](https://rojo.space/docs/6.x/sync-details/#plain-text)     | `*.txt`        |
| [JSON modules](https://rojo.space/docs/6.x/sync-details/#json-modules) | `*.json`       |
