import { HttpService } from "modules/services";
import { makeFile } from "utils/file-utils";

interface JsonData {
	[key: string]: string | number | boolean | JsonData;
}

/** An object to read and write to JSON files. */
export interface JsonStore {
	/** A reference to the original path to the file. */
	readonly file: string;

	/** The current state of the JSON file. */
	data?: JsonData;

	/** Saves the current state to the file. */
	save(): void;

	/** Loads the JSON data of the file. */
	load(): JsonData;
}

/**
 * Creates an object to read and write JSON data in an easier way.
 * @param file The JSON file to open.
 * @returns A JSON data object.
 */
export function openJson(file: string): JsonStore {
	return {
		file: file,
		data: undefined,
		save() {
			if (this.data !== undefined) makeFile(file, HttpService.JSONEncode(this.data));
		},
		load() {
			const data = HttpService.JSONDecode<JsonData>(readfile(file));
			this.data = data;
			return data;
		},
	} as const;
}
