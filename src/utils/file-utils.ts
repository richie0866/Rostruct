/*
 * File: files.ts
 * File Created: Tuesday, 1st June 2021 11:22:40 pm
 * Author: richard
 */

import Object from "@rbxts/object-utils";
import { writeFile } from "api/compatibility";

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
			location: format(location),
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
}
