import Make from "modules/make/init";
import { pathUtils } from "utils/file-utils";
import { fileMetadata } from "./metadata";

/**
 * Transforms a plain text file into a Roblox StringValue.
 * @param sessionId The current session.
 * @param path A path to the text file.
 * @param name The name of the instance.
 * @returns A StringValue object.
 */
export function makePlainText(path: string, name: string) {
	const stringValue = Make("StringValue", { Name: name, Value: readfile(path) });

	// Applies an adjacent meta file if it exists.
	const metaPath = pathUtils.getParent(path) + name + ".meta.json";
	if (isfile(metaPath)) fileMetadata(metaPath, stringValue);

	return stringValue;
}
