/**
 * File types that can be attributed to file descriptors.
 * Enums add extra functionaliy that goes unused when transpiled.
 */
export interface FileType {
	/** The path leads to file. */
	File: "File";

	/** The path leads to directory. */
	Directory: "Directory";
}

export type FileTypeKey = keyof FileType;

/** Base interface for file descriptors. */
export interface Descriptor {
	/** Whether the data is a file or folder. */
	readonly descriptorType: FileTypeKey;

	/** The name of this file. */
	readonly name: string;

	/** The location of this file. */
	readonly location: string;

	/** Optional root directory of this file. */
	readonly origin?: string;
}

/** Data used to construct files and directories. */
export type FileArray = [string, string | undefined][];

export type FileArrayPath<T extends FileArray> = T[number][0];
