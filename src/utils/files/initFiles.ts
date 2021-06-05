import { makeFiles } from "./makeFiles";
import { FileArrayPath } from "./types";

/** Maps a list of files that handle Rostruct file storage. */
const fileArray: [
	["rostruct/", ""],
	["rostruct/cache/", ""],
	["rostruct/cache/git/", ""],
	["rostruct/cache/git_tags.json", "{}"],
] = [
	["rostruct/", ""],
	["rostruct/cache/", ""],
	["rostruct/cache/git/", ""],
	["rostruct/cache/git_tags.json", "{}"],
];

/**
 * Gets the value of `dir .. file`. Mainly used for autocompletes to flag unchanged files when changing paths.
 * @param start The directory to index.
 * @param path The local path.
 * @returns A reference to the file.
 */
export function autocompletePath(start: FileArrayPath<typeof fileArray>, path?: string): string {
	return path !== undefined ? start + path : start;
}

/** Initializes the file structure for Rostruct. */
export function initFiles() {
	makeFiles(fileArray);
}
