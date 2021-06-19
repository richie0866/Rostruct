import zzlib from "modules/zzlib";
import { FileArray, makeFiles, pathUtils } from "utils/file-utils";

/**
 * Extracts files from raw zip data.
 * @param rawData Raw zip data.
 * @param target The directory to extract files to.
 * @param ungroup
 * If the zip file contains a single directory with everthing in it, it may be useful to
 * extract data excluding the folder. This parameter controls whether the top directory
 * is ignored when extracting.
 */
export function extract(rawData: string, target: string, ungroup?: boolean) {
	const zipData = zzlib.unzip(rawData);
	const fileArray: FileArray = [];

	// Convert the path-content map to a file array
	for (const [path, contents] of zipData)
		if (ungroup) {
			// Trim the first folder off the path if 'ungroup' is true
			fileArray.push([pathUtils.addTrailingSlash(target) + (path.gsub("^([^/]*/)", "")[0] as string), contents]);
		} else {
			fileArray.push([pathUtils.addTrailingSlash(target) + path, contents]);
		}

	// Make the files at the given target.
	makeFiles(fileArray);
}
