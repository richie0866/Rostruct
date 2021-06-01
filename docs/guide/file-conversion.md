# File conversion

Rostruct transforms files into Roblox instances loosely following [Roact's sync details](https://rojo.space/docs/6.x/sync-details/).

## Overview

| Concept                       | File Name      |
| ----------------------------- | -------------- |
| [Folders](#folders)           | any directory  |
| Server [scripts](#scripts)    | `*.server.lua` |
| Client [scripts](#scripts)    | `*.client.lua` |
| Module [scripts](#scripts)    | `*.lua`        |
| XML [models](#models)         | `*.rbxmx`      |
| Binary [models](#models)      | `*.rbxm`       |
| [Plain text](#plain-text)     | `*.txt`        |
| [JSON modules](#json-modules) | `*.json`       |

!!! warning
	Currently, Rostruct does not support the following Rojo concepts:

	* Localization tables
	* JSON models
	* Projects
	* Meta files (partially)

	Some file types may never be supported. For example, implementing Rojo project files may fully expose your project to the Roblox client when used.
