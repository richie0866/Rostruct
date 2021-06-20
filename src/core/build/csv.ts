import Make from "modules/make/init";
import Object from "modules/object-utils";
import { pathUtils } from "utils/file-utils";
import { fileMetadata } from "./metadata";

type SettableEntryPropertyName = Exclude<keyof LocalizationEntry, "Values">;

const settableEntryPropertyNames: SettableEntryPropertyName[] = ["Context", "Example", "Key", "Source"];

/** Reads a CSV file and turns it into an array of `LocalizationEntries`. */
class CsvReader {
	/** A list of entries that can be passed to `LocalizationTable.SetEntries()`. */
	public entries: LocalizationEntry[] = [];

	/** The header of the CSV file. Used to map entry columns to the column name. */
	private keys: SettableEntryPropertyName[] = [];

	constructor(
		/** Raw file data. */
		public readonly raw: string,

		/** The raw data split by row. */
		public readonly buffer = raw.split("\n"),
	) {}

	/**
	 * Reads the CSV file and turns it into an array of `LocalizationEntries`.
	 * @returns A list of localization entries.
	 */
	public read() {
		// (i === 1) since otherwise transpiled to (i == 0)
		for (const [i, line] of ipairs(this.buffer))
			if (i === 1) this.readHeader(line);
			else this.readEntry(line);

		return this.entries;
	}

	/**
	 * Turns the header into an array of keys to be used as entry properties.
	 * @param currentLine The first line of the CSV file.
	 */
	public readHeader(currentLine: string) {
		this.keys = currentLine.split(",") as SettableEntryPropertyName[];
	}

	/**
	 * Checks if an entry can have the type of `LocalizationEntry`.
	 * @param entry
	 */
	public validateEntry(entry: LocalizationEntry): boolean {
		return (
			entry.Context !== undefined &&
			entry.Key !== undefined &&
			entry.Source !== undefined &&
			entry.Values !== undefined
		);
	}

	/**
	 * Creates a `LocalizationEntry` for the line in the CSV file.
	 * @param currentLine A line from the CSV file.
	 */
	public readEntry(currentLine: string) {
		const entry: Partial<LocalizationEntry> & { Values: LocalizationEntry["Values"] } = {
			Values: new Map<string, string>(),
		};

		// (i - 1) since otherwise transpiled to (i + 1)
		for (const [i, value] of ipairs(currentLine.split(","))) {
			const key = this.keys[i - 1];

			// If 'key' is a property of the entry, then set it to value.
			// Otherwise, add it to the 'Values' map for locale ids.
			if (settableEntryPropertyNames.includes(key)) entry[key] = value;
			else entry.Values.set(key, value);
		}

		if (this.validateEntry(entry as LocalizationEntry)) this.entries.push(entry as LocalizationEntry);
	}
}

/**
 * Transforms a CSV file into a Roblox LocalizationTable.
 * @param path A path to the CSV file.
 * @param name The name of the instance.
 * @returns A LocalizationTable with entries configured.
 */
export function makeLocalizationTable(path: string, name: string) {
	const csvReader = new CsvReader(readfile(path));

	const locTable = Make("LocalizationTable", { Name: name });
	locTable.SetEntries(csvReader.read());

	// Applies an adjacent meta file if it exists.
	const metaPath = pathUtils.getParent(path) + name + ".meta.json";
	if (isfile(metaPath)) fileMetadata(metaPath, locTable);

	return locTable;
}
