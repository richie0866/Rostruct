/*
 * File: setupFiles.ts
 * File Created: Thursday, 3rd June 2021 10:02:01 pm
 * Author: richard
 */

import * as fileUtils from "utils/file-utils";

/** Maps a list of files that handle Rostruct file storage. */
const fileMap = {
	"rostruct/": "",
	"rostruct/cache/": "",
	"rostruct/cache/modules/": "",
	"rostruct/cache/repos/": "",
	"rostruct/cache/repo_tags.json": "{}",
} as const;

/**
 * Gets the value of `dir .. file`. Used for autocompletes.
 * @param dir The directory to index.
 * @param file The local path.
 * @returns A reference to the file.
 */
export function getPath(dir: keyof typeof fileMap, file: string): string {
	return dir + file;
}

// Set up the file structure for Rostruct.
fileUtils.makeFiles(fileUtils.fileMapToFileArray(fileMap));
