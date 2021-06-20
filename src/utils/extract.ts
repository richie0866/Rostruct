import zzlib from "modules/zzlib";
import { FileArray, makeFiles, pathUtils } from "utils/file-utils";

/**
 * Extracts files from raw zip data.
 * @param rawData Raw zip data.
 * @param target The directory to extract files to.
 * @param ungroup
 * If the zip file contains a single directory, it may be useful to ungroup the files inside.
 * This parameter controls whether the top-level directory is ignored.
 */
export function extract(rawData: string, target: string, ungroup?: boolean) {
	const zipData = zzlib.unzip(rawData);
	const fileArray: FileArray = [];

	// Convert the path-content map to a file array
	for (const [path, contents] of zipData)
		ungroup
			? // Trim the first folder off the path if 'ungroup' is true
			  fileArray.push([pathUtils.addTrailingSlash(target) + path.match("^[^/]*/(.*)$")[0], contents])
			: fileArray.push([pathUtils.addTrailingSlash(target) + path, contents]);

	// Make the files at the given target
	makeFiles(fileArray);
}
