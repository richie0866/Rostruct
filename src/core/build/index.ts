import { Session } from "core/Session";
import { pathUtils } from "utils/file-utils";
import { makeLocalizationTable } from "./csv";
import { makeDir } from "./dir";
import { makeJsonModule } from "./json";
import { makeJsonModel } from "./json-model";
import { makeLua, makeLuaInit } from "./lua";
import { makeRobloxModel } from "./rbx-model";
import { makePlainText } from "./txt";

/**
 * Tries to turn the file or directory at `path` into an Instance. This function is recursive!
 * @param session The current Session.
 * @param path The file to turn into an object.
 * @returns The Instance made from the file.
 */
export function build(session: Session, path: string): Instance | undefined {
	if (isfolder(path)) {
		let instance: Instance;

		const luaInitPath = pathUtils.locateFiles(path, ["init.lua", "init.server.lua", "init.client.lua"]);

		if (luaInitPath !== undefined) {
			instance = makeLuaInit(session, path + luaInitPath);
		} else {
			instance = makeDir(path);
		}

		// Populate the instance here! This is a workaround for a possible
		// cyclic reference when attempting to call 'makeObject' from another
		// file.
		for (const child of listfiles(path)) {
			const childInstance = build(session, pathUtils.addTrailingSlash(child));
			if (childInstance) childInstance.Parent = instance;
		}

		return instance;
	} else if (isfile(path)) {
		const name = pathUtils.getName(path);

		// Lua script
		// https://rojo.space/docs/6.x/sync-details/#scripts
		if (
			name.match("(%.lua)$")[0] !== undefined &&
			name.match("^(init%.)")[0] === undefined // Ignore init scripts
		) {
			return makeLua(session, path);
		}
		// Ignore meta files
		else if (name.match("(%.meta.json)$")[0] !== undefined) return;
		// JSON model
		// https://rojo.space/docs/6.x/sync-details/#json-models
		else if (name.match("(%.model.json)$")[0] !== undefined) {
			return makeJsonModel(path, name.match("^(.*)%.model.json$")[0] as string);
		}
		// Project node
		// Unsupported by Rostruct
		else if (name.match("(%.project.json)$")[0] !== undefined) {
			warn(`Project files are not supported (${path})`);
		}
		// JSON module
		// https://rojo.space/docs/6.x/sync-details/#json-modules
		else if (name.match("(%.json)$")[0] !== undefined) {
			return makeJsonModule(session, path, name.match("^(.*)%.json$")[0] as string);
		}
		// Localization table
		// https://rojo.space/docs/6.x/sync-details/#localization-tables
		else if (name.match("(%.csv)$")[0] !== undefined) {
			return makeLocalizationTable(path, name.match("^(.*)%.csv$")[0] as string);
		}
		// Plain text
		// https://rojo.space/docs/6.x/sync-details/#plain-text
		else if (name.match("(%.txt)$")[0] !== undefined) {
			return makePlainText(path, name.match("^(.*)%.txt$")[0] as string);
		}
		// Binary model
		// https://rojo.space/docs/6.x/sync-details/#models
		else if (name.match("(%.rbxm)$")[0] !== undefined) {
			return makeRobloxModel(path, name.match("^(.*)%.rbxm$")[0] as string);
		}
		// XML model
		// https://rojo.space/docs/6.x/sync-details/#models
		else if (name.match("(%.rbxmx)$")[0] !== undefined) {
			return makeRobloxModel(path, name.match("^(.*)%.rbxmx$")[0] as string);
		}
	}
}
