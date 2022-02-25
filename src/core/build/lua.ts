import { Session } from "core/Session";
import { VirtualScript } from "core/VirtualScript";
import Make from "modules/make";
import { replace } from "utils/replace";
import { pathUtils } from "utils/file-utils";
import { fileMetadata } from "./metadata";

const TRAILING_TO_CLASS: { [trailing: string]: "Script" | "ModuleScript" | "LocalScript" } = {
	".server.lua": "Script",
	".client.lua": "LocalScript",
	".lua": "ModuleScript",
} as const;

/**
 * Transforms a Lua file into a Roblox script.
 * @param session The current session.
 * @param path A path to the Lua file.
 * @param name The name of the instance.
 * @returns A Lua script with a VirtualScript binding.
 */
export function makeLua(session: Session, path: string, nameOverride?: string): LuaSourceContainer {
	const fileName = pathUtils.getName(path);

	// Look for a name and file type that fits:
	const [name, match] =
		replace(fileName, "(%.client%.lua)$", "") ||
		replace(fileName, "(%.server%.lua)$", "") ||
		replace(fileName, "(%.lua)$", "") ||
		error(`Invalid Lua file at ${path}`);

	// Creates an Instance for the preceding match.
	// If an error was not thrown, this line should always succeed.
	const instance = Make(TRAILING_TO_CLASS[match], { Name: nameOverride ?? name });

	// Create and track a VirtualScript object for this file:
	session.virtualScriptAdded(new VirtualScript(instance, path, session.root));

	// Applies an adjacent meta file if it exists.
	// This includes init.meta.json files!
	const metaPath = pathUtils.getParent(path) + name + ".meta.json";
	if (isfile(metaPath)) fileMetadata(metaPath, instance);

	return instance;
}

/**
 * Transforms the parent directory into a Roblox script.
 * @param session The current session.
 * @param path A path to the `init.*.lua` file.
 * @param name The name of the instance.
 * @returns A Lua script with a VirtualScript binding.
 */
export function makeLuaInit(session: Session, path: string): Instance {
	// The parent directory will always exist for an init file.
	const parentDir = pathUtils.getParent(path)!;
	const instance = makeLua(session, path, pathUtils.getName(parentDir));

	return instance;
}
