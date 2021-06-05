import { writeFile } from "utils/files";

interface JSONData {
	[key: string]: string | number | boolean | JSONData;
}

/** An object to read and write to JSON files. */
export interface JSONInterface {
	/** A reference to the original path to the file. */
	readonly file: string;

	/** The data that was decoded. */
	readonly data: JSONData;

	/** Saves the current JSON data to the file. */
	save(): void;
}

const HttpService = game.GetService("HttpService");

/**
 * Creates an object to read and write JSON data in an easier way.
 * @param file The JSON file to open.
 * @returns A JSON data object.
 */
export function openJson(file: string): JSONInterface {
	return {
		file: file,
		data: HttpService.JSONDecode<JSONData>(readfile(file)),
		save() {
			writeFile(file, HttpService.JSONEncode(this.data));
		},
	} as const;
}
