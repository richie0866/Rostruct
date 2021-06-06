import { HttpService } from "packages/services";
import { makeFile } from "utils/filesystem";

interface JSONData {
	[key: string]: string | number | boolean | JSONData;
}

/** An object to read and write to JSON files. */
export interface JSONInterface {
	/** A reference to the original path to the file. */
	readonly file: string;

	/** The current state of the JSON file. */
	data?: JSONData;

	/** Saves the current state to the file. */
	save(): void;

	/** Loads the JSON data of the file. */
	load(): JSONData;
}

/**
 * Creates an object to read and write JSON data in an easier way.
 * @param file The JSON file to open.
 * @returns A JSON data object.
 */
export function openJson(file: string): JSONInterface {
	return {
		file: file,
		data: undefined,
		save() {
			if (this.data !== undefined) makeFile(file, HttpService.JSONEncode(this.data));
		},
		load() {
			const data = HttpService.JSONDecode<JSONData>(readfile(file));
			this.data = data;
			return data;
		},
	} as const;
}
