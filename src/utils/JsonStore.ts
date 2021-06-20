import { HttpService, RunService } from "modules/services";

interface JsonData {
	[key: string]: string | number | boolean | JsonData;
}

/** An object to read and write to JSON files. */
export class JsonStore {
	/** The current state of the JSON file. */
	private state?: JsonData;

	constructor(
		/** A reference to the original path to the file. */
		public readonly file: string,
	) {
		assert(isfile(file), `File '${file}' must be a valid JSON file`);
	}

	/** Gets a value from the current state. */
	public get<T extends string>(key: T): JsonData[T] {
		assert(this.state, "The JsonStore must be open to read from it");
		return this.state[key];
	}

	/** Gets a value from the current state. */
	public set<T extends string>(key: T, value: JsonData[T]) {
		assert(this.state, "The JsonStore must be open to write to it");
		this.state[key] = value;
	}

	/** Loads the state of the file. */
	public open() {
		assert(this.state === undefined, "Attempt to open an active JsonStore");
		const state = HttpService.JSONDecode<JsonData>(readfile(this.file));
		Promise.defer((_, reject) => {
			if (this.state === state) {
				this.close();
				reject("JsonStore was left open; was the thread blocked before it could close?");
			}
		});
		this.state = state;
	}

	/** Saves the current state of the file. */
	public close() {
		assert(this.state, "Attempt to close an inactive JsonStore");
		writefile(this.file, HttpService.JSONEncode(this.state));
		this.state = undefined;
	}
}
