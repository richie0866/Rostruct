/*
 * File: files.ts
 * File Created: Tuesday, 1st June 2021 11:22:40 pm
 * Author: richard
 */

interface Descriptor {
	/** Whether the data is a file or folder. */
	descriptorType: Files.FileType;

	/** The name of this file. */
	fileName: string;

	/** The location of this file. */
	location: string;

	/** Optional root directory of this file. */
	origin?: string;
}

export interface Directory extends Descriptor {
	/** This describes a directory. */
	descriptorType: Files.FileType.Directory;
}

export interface File<T extends Files.FileType.File | Files.FileType.Unknown> extends Descriptor {
	/** This describes a file. */
	descriptorType: T;

	/** The name excluding the type (e.g. **script**.client.lua). */
	name: string;

	/** The name excluding the extension (e.g. **script.client**.lua). */
	extendedName: string;

	/** The extension of this file (e.g. script.client.**lua**). */
	extension?: string;

	/** The full extension of this file (e.g. script.**client.lua**). */
	type?: string;
}

export namespace Files {
	export enum FileType {
		File,
		Directory,
		Unknown,
	}

	export type FileOrUnknown = FileType.File | FileType.Unknown;

	/** Checks whether the given path points to a file or folder. */
	export function exists(path: string): boolean {
		return isfile(path) || isfolder(path);
	}

	/** Adds a trailing slash if there is no extension. */
	export function format(path: string): string {
		path = path.gsub("\\", "/")[0];
		if (path.match("%.([^%./]+)$")[0] === undefined && path.sub(-1) !== "/") return path + "/";
		else return path;
	}

	/** Guess the FileType of a path based on the last characters. */
	export function infer(path: string, words = path.match("([^/]+)$")[0] as string | undefined): FileType {
		if (words === undefined) return FileType.Directory;
		else if (words.find("%.") !== undefined) return FileType.File;
		else return FileType.Unknown;
	}

	/** Finds a file in the directory. */
	export function locate(directory: Directory, ...files: string[]): File<FileOrUnknown> | undefined {
		for (const file of files) {
			const target = directory.location + file;
			if (isfile(target)) return describeFile(target, directory.origin);
		}
	}

	/** Create a file interface. */
	export function describeFile(
		location: string,
		origin?: string,
		descriptorType = infer(location),
	): File<FileOrUnknown> {
		const fileName = location.match("([^/]+)$")[0] as string;

		const name = (fileName.match("^([^%.]+)")[0] as string) ?? "";
		const extension = fileName.match("%.([^%.]+)$")[0] as string | undefined;
		const extendedName = extension !== undefined ? fileName.sub(1, -extension.size() - 2) : name;
		const fileType = fileName.match("%.(.*)")[0] as string;

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
			location: format(location),
			origin: origin,
		};
	}
}
