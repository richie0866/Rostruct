/*
 * File: file-utils.ts
 * File Created: Tuesday, 1st June 2021 11:22:40 pm
 * Author: richard
 * Description: Utility for describing files and directories. Does not use classes to help with performance, as
 * file descriptors are more like constant data.
 */

import Object from "packages/object-utils";

// Enums transpile to tables with functionality that goes unused,
// so use a constant.
export const FileType: { File: "File"; Directory: "Directory"; Unknown: "Unknown" } = {
	/** The path leads to file. */
	File: "File",
	/** The path leads to directory. */
	Directory: "Directory",
	/** The path leads to a file with no extension. */
	Unknown: "Unknown",
};
export type FileType = keyof typeof FileType;
export type FileOrUnknown = typeof FileType["File" | "Unknown"];

interface Descriptor {
	/** Whether the data is a file or folder. */
	readonly descriptorType: keyof typeof FileType;

	/** The name of this file. */
	readonly fileName: string;

	/** The location of this file. */
	readonly location: string;

	/** Optional root directory of this file. */
	readonly origin?: string;
}

export interface Directory extends Descriptor {
	/** This describes a directory. */
	readonly descriptorType: typeof FileType.Directory;
}

export interface File extends Descriptor {
	/** This describes a file. */
	readonly descriptorType: FileOrUnknown;

	/** The name excluding the type (e.g. **script**.client.lua). */
	readonly name: string;

	/** The name excluding the extension (e.g. **script.client**.lua). */
	readonly extendedName: string;

	/** The extension of this file (e.g. script.client.**lua**). */
	readonly extension?: string;

	/** The full extension of this file (e.g. script.**client.lua**). */
	readonly type?: string;
}

/** Append a file with no extension with `.file`. */
export function fixUnknownFile(file: string): string {
	const hasExtension = file.reverse().match("^([^%./]+%.)")[0] !== undefined;
	if (!hasExtension) return file + ".file";
	else return file;
}

/** Safely writes files by appending files with no extensions with `.file`. */
export function writeFile(file: string, content: string) {
	writefile(fixUnknownFile(file), content);
}

/** Checks whether the given path points to a file or folder. */
export function checkPath(path: string): boolean {
	return isfile(path) || isfolder(path);
}

/** Adds a trailing slash if there is no extension. */
export function formatPath(path: string): string {
	path = path.gsub("\\", "/")[0];
	if (path.match("%.([^%./]+)$")[0] === undefined && path.sub(-1) !== "/") return path + "/";
	else return path;
}

/** Guess the FileType of a path based on the last characters. */
export function inferFileType(path: string, words = path.match("([^/]+)$")[0] as string | undefined): FileType {
	if (words === undefined) return FileType.Directory;
	else if (words.find("%.") !== undefined) return FileType.File;
	else return FileType.Unknown;
}

/** Finds a file in the directory. */
export function locateFiles(directory: Directory, ...files: string[]): File | undefined {
	for (const file of files) {
		const target = directory.location + file;
		if (isfile(target)) return describeFile(target, directory.origin);
	}
}

/** Create a file interface. */
export function describeFile(location: string, origin?: string, descriptorType = inferFileType(location)): File {
	// 'fileName' is never null because the location must have a /
	const fileName = location.match("([^/]+)$")[0] as string;

	// 'name' can be null, but shouldn't be set to undefined /
	const name = (fileName.match("^([^%.]+)")[0] as string) ?? "";

	const extension = fileName.match("%.([^%.]+)$")[0] as string | undefined;
	const extendedName = extension !== undefined ? fileName.sub(1, -extension.size() - 2) : name;
	const fileType = fileName.match("%.(.*)")[0] as string | undefined;

	return {
		descriptorType: descriptorType as FileOrUnknown,
		fileName: fileName,
		name: name,
		extendedName: extendedName,
		extension: extension,
		type: fileType,
		location: location,
		origin: origin,
	};
}

/** Create a folder interface. */
export function describeDirectory(location: string, origin?: string): Directory {
	return {
		descriptorType: FileType.Directory,
		fileName: location.match("([^/]+)/*$")[0] as string,
		location: formatPath(location),
		origin: origin,
	};
}

/** Create an array of the file paths & contents from a file-content map. */
export function fileMapToFileArray(fileMap: {
	[fileName: string]: string | undefined;
}): [string, string | undefined][] {
	const fileArray: [string, string | undefined][] = [];
	for (const [path, contents] of Object.entries(fileMap)) {
		if (type(path) === "string") fileArray.push([path as string, contents]);
	}
	return fileArray;
}

/** Creates files from a list of paths. */
export function makeFiles(fileArray: [string, string | undefined][]) {
	// Sort the paths to make certain folders first.
	fileArray.sort((a, b) => a[0].gsub("/", "/")[1] < b[0].gsub("/", "/")[1]);

	// Create directories first! Files made before their parent folders fail with no error.
	for (const [path] of fileArray) if (path.sub(-1) === "/") makefolder(path);

	// Then, create the files.
	for (const [path, contents] of fileArray) if (path.sub(-1) !== "/") writeFile(path, contents ?? "");
}
