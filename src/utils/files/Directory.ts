import { File } from "./File";
import { Descriptor, FileType } from "./types";

/** Describes directory metadata based on a given file location. */
export interface Directory extends Descriptor {
	/** The object describes a directory. */
	readonly descriptorType: FileType["Directory"];

	/** The name of this directory. */
	readonly name: string;

	/** The location of this file. */
	readonly location: string;

	/** Optional root directory of this file. */
	readonly origin?: string;

	/** Finds a file in the directory. */
	locateFiles: (...files: string[]) => File | undefined;
}

/** Creates a new Directory object. */
export function Directory(location: string, origin?: string): Directory {
	return {
		descriptorType: "Directory",
		location: location,
		origin: origin,

		name: location.match("([^/]+)/*$")[0] as string,

		locateFiles: (...files: string[]) => {
			for (const file of files) {
				const target = location + file;
				if (isfile(target)) return File(target, origin);
			}
		},
	};
}
