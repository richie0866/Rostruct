import { FileArray } from "./types";

/** Adds a trailing slash if there is no extension. */
export function formatPath(path: string): string {
	path = path.gsub("\\", "/")[0];
	if (path.match("%.([^%./]+)$")[0] === undefined && path.sub(-1) !== "/") return path + "/";
	else return path;
}

/** Append a file with no extension with `.file`. */
export function addMissingExtension(file: string): string {
	const hasExtension = file.reverse().match("^([^%./]+%.)")[0] !== undefined;
	if (!hasExtension) return file + ".file";
	else return file;
}

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
	writefile(addMissingExtension(file), content ?? "");
}

/** Creates files from a list of paths. */
export function makeFiles(fileArray: FileArray, map?: (path: string) => string) {
	// Create the files and directories. No sorts need to be performed because parent folders
	// in each path are made before the file/folder itself.
	for (const [path, contents] of fileArray)
		if (path.sub(-1) === "/" && !isfolder(path)) map ? makeFolder(map(path)) : makeFolder(path);
		else if (path.sub(-1) !== "/" && !isfile(path)) map ? makeFile(map(path), contents) : makeFile(path, contents);
}
