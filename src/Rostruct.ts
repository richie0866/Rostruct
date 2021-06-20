import { Session, VirtualScript, Executor } from "core";
import { downloadLatestRelease, downloadRelease, FetchInfo } from "utils/fetch-github-release";
import { pathUtils } from "utils/file-utils";

type FetchParams = Parameters<typeof downloadRelease>;
type FetchLatestParams = Parameters<typeof downloadLatestRelease>;

/** Transforms files into Roblox objects and handles runtime. */
class Rostruct {
	/** The Session for this project. */
	private readonly session: Session;

	/** The project transformed into a Roblox instance. */
	readonly tree: Instance;

	/** The location of the project. */
	readonly location: string;

	/** Information about the last call of `fetch` or `fetchLatest`. */
	readonly fetchInfo?: FetchInfo;

	constructor(dir: string, fetchInfo?: FetchInfo) {
		assert(type(dir) === "string", "(Rostruct) The target path must be a string");
		assert(!fetchInfo || type(fetchInfo) === "table", "(Rostruct) Invalid fetch info");

		const location = fetchInfo
			? fetchInfo.location + pathUtils.addTrailingSlash(dir)
			: pathUtils.addTrailingSlash(dir);

		assert(isfolder(location), `(Rostruct) The target path ${location} is not a valid directory`);

		this.location = location;
		this.fetchInfo = fetchInfo;

		this.session = new Session(location);
		this.tree = this.session.init();
	}

	/**
	 * Sets the top-level instance's properties. Used for inline module loading.
	 * @param properties A map of property names and values.
	 * @returns The Rostruct object.
	 */
	set(properties: Map<keyof WritableInstanceProperties<Instance>, never>) {
		for (const [prop, value] of properties) this.tree[prop] = value;
		return this;
	}

	/**
	 * Simulate script runtime by running LocalScripts on deferred threads.
	 * @returns
	 * A promise that resolves with an array of scripts that finished executing.
	 * If one script throws an error, the entire promise will cancel.
	 */
	defer(): Promise<LocalScript[]> {
		return this.session.simulate();
	}

	/**
	 * Requires the top-level ModuleScript, `tree`.
	 * @returns A promise that resolves with what the module returned.
	 */
	async require(): Promise<ReturnType<Executor>> {
		assert(classIs(this.tree, "ModuleScript"), `Object at path ${this.location} must be a module`);
		return VirtualScript.loadModule(this.tree);
	}

	/**
	 * Requires the top-level ModuleScript, `tree`.
	 * @returns What the module returned.
	 */
	requireAsync(): ReturnType<Executor> {
		return this.require().expect();
	}
}

/* Use const functions to mimic static class functions.
   Using static functions forces 'export =' in 'index.ts', so use constants. */

/**
 * Transforms the files at `dir` into Roblox objects.
 * Returns a new `Rostruct` class to help handle runtime.
 * @param dir A path to the project directory.
 * @returns A new Rostruct object.
 */
export const build = (dir: string): Rostruct => new Rostruct(dir);

/**
 * Downloads and builds a release from the given repository.
 * If `asset` is undefined, it downloads source files through the zipball URL.
 * Automatically extracts .zip files.
 *
 * @param target Build a specific directory in the downloaded release.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param tag The release tag to download.
 * @param asset Optional asset to download. Defaults to the source files.
 *
 * @returns A promise that resolves with a Rostruct object.
 */
export const fetch = async (target = "", ...args: FetchParams): Promise<Rostruct> =>
	new Rostruct(target, await downloadRelease(...args));

/**
 * **This function does not download prereleases or drafts.**
 *
 * Downloads and builds the latest release release from the given repository.
 * If `asset` is undefined, it downloads source files through the zipball URL.
 * Automatically extracts .zip files.
 *
 * @param target Build a specific directory in the downloaded release.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param asset Optional asset to download. Defaults to the source files.
 *
 * @returns A promise that resolves with a Rostruct object and the download result.
 */
export const fetchLatest = async (target = "", ...args: FetchLatestParams): Promise<Rostruct> =>
	new Rostruct(target, await downloadLatestRelease(...args));
