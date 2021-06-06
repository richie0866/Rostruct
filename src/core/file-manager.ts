import { FileArrayPath, makeFiles } from "utils/filesystem";

/** Maps a list of files that handle Rostruct file storage. */
const fileArray: [
	["rostruct/", ""],
	["rostruct/cache/", ""],
	["rostruct/cache/releases/", ""],
	["rostruct/cache/release_tags.json", "{}"],
] = [
	["rostruct/", ""],
	["rostruct/cache/", ""],
	["rostruct/cache/releases/", ""],
	["rostruct/cache/release_tags.json", "{}"],
];

/**
 * Gets the value of `dir .. file`. Mainly used with linting to flag unchanged files when changing paths.
 * Might be bad practice! Let me know of better ways to do this.
 * @param start The directory to index.
 * @param path The local path.
 * @returns A reference to the file.
 */
export function lintPath(start: FileArrayPath<typeof fileArray>, path?: string): string {
	return path !== undefined ? start + path : start;
}

/** Initializes the file structure for Rostruct. */
export function init() {
	makeFiles(fileArray);
}
