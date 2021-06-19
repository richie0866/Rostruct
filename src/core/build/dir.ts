import Make from "modules/make/init";
import { pathUtils } from "utils/file-utils";
import { directoryMetadata } from "./metadata";

/**
 * Transforms a directory into a Roblox folder.
 * If an `init.meta.json` file exists, create an Instance from the file.
 * @param sessionId The current session.
 * @param path A path to the directory.
 * @returns A Folder object, or an object created by a meta file.
 */
export function makeDir(path: string): Folder | CreatableInstances[keyof CreatableInstances] {
	const metaPath = path + "init.meta.json";

	if (isfile(metaPath)) return directoryMetadata(metaPath, pathUtils.getName(path));

	return Make("Folder", {
		Name: pathUtils.getName(path),
	});
}
