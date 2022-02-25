/** Formats the given path. **The path must be a real file or folder!** */
export function formatPath(path: string): string {
	assert(isfile(path) || isfolder(path), `'${path}' does not point to a folder or file`);

	// Replace all slashes with forward slashes
	path = path.gsub("\\", "/")[0];

	// Add a trailing slash
	if (isfolder(path)) {
		if (path.sub(-1) !== "/") path += "/";
	}

	return path;
}

/** Adds a trailing slash if there is no extension. */
export function addTrailingSlash(path: string): string {
	path = path.gsub("\\", "/")[0];
	if (path.match("%.([^%./]+)$")[0] === undefined && path.sub(-1) !== "/") return path + "/";
	else return path;
}

export function trimTrailingSlash(path: string): string {
	path = path.gsub("\\", "/")[0];
	if (path.sub(-1) === "/") return path.sub(0, -2);
	else return path;
}

/** Appends a file with no extension with `.file`. */
export function addExtension(file: string): string {
	const hasExtension = file.reverse().match("^([^%./]+%.)")[0] !== undefined;
	if (!hasExtension) return file + ".file";
	else return file;
}

/** Gets the name of a file or folder. */
export function getName(path: string): string {
	return path.match("([^/]+)/*$")[0] as string;
}

/** Returns the parent directory. */
export function getParent(path: string): string | undefined {
	return path.match("^(.*[/])[^/]+")[0] as string;
}

/** Returns the first file that exists in the directory. */
export function locateFiles(dir: string, files: string[]): string | undefined {
	return files.find((file: string) => isfile(dir + file));
}
