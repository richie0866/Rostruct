import { Descriptor } from "./types";

/** Describes file metadata based on a given file location. */
export interface File extends Descriptor {
	/** This describes a file. */
	readonly descriptorType: "File";

	/** The name of this file. */
	readonly name: string;

	/** The name excluding the type (e.g. **script**.client.lua). */
	readonly shortName: string;

	/** The extension of this file (e.g. script.client.**lua**). */
	readonly extension?: string;

	/** The name excluding the extension (e.g. **script.client**.lua). */
	readonly extendedName: string;

	/** The full extension of this file (e.g. script.**client.lua**). */
	readonly type?: string;
}

/** Creates a new File object. */
export function File(location: string, origin?: string): File {
	/** **script.client.lua** */
	const name = location.match("([^/]+)/*$")[0] as string;

	/** **script**.client.lua */
	const shortName = (name.match("^([^%.]+)")[0] as string) ?? "";

	/** script.client.**lua** */
	const extension = name.match("%.([^%.]+)$")[0] as string | undefined;

	/** **script.client**.lua */
	const extendedName = extension !== undefined ? name.sub(1, -extension.size() - 2) : name;

	/** script.**client.lua** */
	const fileType = name.match("%.(.*)")[0] as string | undefined;

	return {
		descriptorType: "File",
		location: location,
		origin: origin,

		name: location.match("([^/]+)/*$")[0] as string,
		shortName: shortName,
		extendedName: extendedName,

		extension: extension,
		type: fileType,
	};
}
