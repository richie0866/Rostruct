import * as pathUtils from "./path-utils";

/** Data used to construct files and directories. */
export type FileArray = [string, string | undefined][];

/**
 * Safely makes a folder by creating every parent before the final directory.
 * Ignores the final file if there is no trailing slash.
 * @param location The path of the directory to make.
 */
export function makeFolder(location: string) {
	let absolutePath = "";
	for (const [name] of location.gmatch("[^/]*/")) makefolder((absolutePath += name));
}

/**
 * Safely makes a file by creating every parent before the file.
 * Adds a `.file` extension if there is no extension.
 * @param location The path of the file to make.
 * @param content Optional file contents.
 */
export function makeFile(file: string, content?: string) {
	makeFolder(file);
	writefile(pathUtils.addExtension(file), content ?? "");
}

/**
 * Safely creates files from the given list of paths.
 * The first string in the file array element is the path,
 * and the second string is the optional file contents.
 * @param fileArray A list of files to create and their contents.
 */
export function makeFiles(fileArray: FileArray) {
	// Create the files and directories. No sorts need to be performed because parent folders
	// in each path are made before the file/folder itself.
	for (const [path, contents] of fileArray)
		if (path.sub(-1) === "/" && !isfolder(path)) makeFolder(path);
		else if (path.sub(-1) !== "/" && !isfile(path)) makeFile(path, contents);
}
