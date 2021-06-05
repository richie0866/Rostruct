/*
 * File: transformFile.ts
 * File Created: Thursday, 3rd June 2021 11:13:25 pm
 * Author: richard
 * Description: Turns a file into a Roblox instance.
 */

import { generateAssetId } from "globals";
import Make from "packages/make";
import { File } from "utils/files";
import { VirtualScript } from "core/VirtualScript";

const HttpService = game.GetService("HttpService");

/**
 * Creates an Instance using the given file information.
 * If the object was a script, a reference to the file path is stored in the `Source` parameter.
 * @param file The file to make an Instance from.
 * @param name Optional name of the instance.
 * @param parent Optional parent of the Instance.
 * @returns A new Instance if possible.
 */
function transformFile(file: File, scope: number, name?: string): Instance | undefined {
	switch (file.extension) {
		// Script
		// Creates a VirtualScript which executes the file as the instance.
		case "lua":
			let luaObj: LuaSourceContainer;

			switch (file.type) {
				// Server script
				case "server.lua":
					luaObj = Make("Script", { Name: name ?? file.shortName, Source: file.location });
					break;

				// Client script
				case "client.lua":
					luaObj = Make("LocalScript", { Name: name ?? file.shortName, Source: file.location });
					break;

				// Module script
				// Use 'extendedName' so modules like '*.spec.lua' don't lose 'spec'
				default:
					luaObj = Make("ModuleScript", { Name: name ?? file.extendedName, Source: file.location });
			}

			new VirtualScript(luaObj, file as File, scope);

			return luaObj;

		// JSON module
		// Creates a VirtualScript which returns the decoded JSON data.
		case "json":
			const jsonObj = Make("ModuleScript", { Name: name ?? file.extendedName });
			new VirtualScript(jsonObj, file as File, scope).setExecutor(() =>
				HttpService.JSONDecode(readfile(file.location)),
			);
			return jsonObj;

		// Plain text
		// Creates a StringValue to represent the text file.
		case "txt":
			const txtObj = Make("StringValue", {
				Name: name ?? file.extendedName,
				Value: readfile(file.location),
			});
			return txtObj;

		// Binary model file
		// Loads a model file by moving the file to Roblox's content folder
		// and calling GetObjects.
		case "rbxm":
			assert(generateAssetId, `This exploit does not support rbxasset:// generation! (${file.location})`);
			return game.GetObjects(generateAssetId(file.location))[0];

		// XML model file
		// Loads a model file by moving the file to Roblox's content folder
		// and calling GetObjects.
		case "rbxmx":
			assert(generateAssetId, `This exploit does not support rbxasset:// generation! (${file.location})`);
			return game.GetObjects(generateAssetId(file.location))[0];

		default:
			break;
	}
}

export = transformFile;
