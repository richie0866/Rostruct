import zzlib from "packages/zzlib";
import { FileArray, formatPath, makeFiles } from "utils/filesystem";

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
	for (const [path, contents] of zipData) fileArray.push([path, contents]);

	// Make the files at the given target.
	// If 'ungroup' is true, excludes the first folder.
	makeFiles(
		fileArray,
		(path: string) => formatPath(target) + (ungroup ? (path.gsub("^([^/]*/)", "")[0] as string) : path),
	);
}
