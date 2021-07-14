import { Session } from "core/Session";
import { VirtualScript } from "core/VirtualScript";
import Make from "modules/make/init";
import { HttpService } from "modules/services";
import { pathUtils } from "utils/file-utils";
import { fileMetadata } from "./metadata";

/**
 * Transforms a JSON file into a Roblox module.
 * @param session The current session.
 * @param path A path to the JSON file.
 * @param name The name of the instance.
 * @returns A ModuleScript with a VirtualScript binding.
 */
export function makeJsonModule(session: Session, path: string, name: string): ModuleScript {
	const instance = Make("ModuleScript", { Name: name });

	// Creates and tracks a VirtualScript object for this file.
	// The VirtualScript returns the decoded JSON data when required.
	const virtualScript = new VirtualScript(instance, path, session.root);
	virtualScript.setExecutor(() => HttpService.JSONDecode(virtualScript.source));
	session.virtualScriptAdded(virtualScript);

	// Applies an adjacent meta file if it exists.
	const metaPath = pathUtils.getParent(path) + name + ".meta.json";
	if (isfile(metaPath)) fileMetadata(metaPath, instance);

	return instance;
}
