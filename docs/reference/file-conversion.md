# File conversion

Rostruct file conversion is designed to mirror [Rojo's sync details](https://rojo.space/docs/6.x/sync-details/).

Concepts on the table below will redirect you their respective Rojo pages.

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

!!! warning
	Currently, Rostruct does not support the following Rojo concepts:

	* Localization tables
	* JSON models
	* Projects
	* Meta files (partially)

!!! tip
	Due to Rostruct being an exploiting tool, there are some key differences from Rojo:

	* `.rbxm` and `.rbxmx` files are fully supported
    	* Binary model files are currently buggy in Rojo
	* Rojo project files will not be supported
    	* Project files structure your codebase around the `game` object, which would expose your project to the client.

	Exercise caution when using these features with Rojo, and keep track of their Github page for updates!
