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

/** Safely writes files by appending files with no extensions with `.file`. */
export function writeFile(file: string, content: string) {
	writefile(addMissingExtension(file), content);
}

/** Creates files from a list of paths. */
export function makeFiles(fileArray: FileArray) {
	// Sort the paths to make certain folders first.
	fileArray.sort((a, b) => a[0].gsub("/", "/")[1] < b[0].gsub("/", "/")[1]);

	// Create directories first! Files made before their parent folders fail with no error.
	for (const [path] of fileArray) if (path.sub(-1) === "/") makefolder(path);

	// Then, create the files.
	for (const [path, contents] of fileArray) if (path.sub(-1) !== "/") writeFile(path, contents ?? "");
}
