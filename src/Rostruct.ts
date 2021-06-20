import { Session, VirtualScript, Executor } from "core";
import { downloadLatestRelease, downloadRelease, FetchInfo } from "utils/fetch-github-release";
import { pathUtils } from "utils/file-utils";

/** Transforms files into Roblox objects and handles runtime. */
class Rostruct {
	/** The Session for this project. */
	private readonly session: Session;

	/** The project transformed into a Roblox instance. */
	readonly tree: Instance;

	/** The location of the project. */
	readonly location: string;

	/** Turns the directory and all of its descendants into Roblox objects. */
	constructor(dir: string) {
		const location = pathUtils.addTrailingSlash(dir);
		assert(type(location) === "string", "(Rostruct) The target path must be a string");
		assert(isfolder(location), "(Rostruct) The target path must be a valid directory");
		this.location = location;
		this.session = new Session(location);
		this.tree = this.session.init();
	}

	/**
	 * Runs every virtual LocalScript on deferred threads.
	 * @returns
	 * A promise that resolves with an array of scripts that finished executing.
	 * If one script throws an error, the entire promise will cancel.
	 */
	defer(): Promise<LocalScript[]> {
		return this.session.simulate();
	}

	/**
	 * Requires the top-level ModuleScript, `tree`.
	 * @returns
	 * A promise that resolves with an array of scripts that finished executing.
	 * If one script throws an error, the entire promise will cancel.
	 */
	async require(): Promise<ReturnType<Executor>> {
		assert(classIs(this.tree, "ModuleScript"), `Object at path ${this.location} must be a module`);
		return VirtualScript.loadModule(this.tree);
	}
}

/**
 * Transforms the files at `dir` into Roblox objects.
 * Returns a new `Rostruct` class to help handle runtime.
 * @param dir A path to the project directory.
 * @returns A new Rostruct object.
 */
export const build = (dir: string) => new Rostruct(dir);

/**
 * Downloads a release from the given repository.
 * If `assetName` is undefined, it downloads the source zip files and extracts them.
 * Automatically extracts .zip files. This function does not download prereleases or drafts.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param tag The release tag to download.
 * @param assetName Optional asset to download. Defaults to the source files.
 * @returns A download result interface.
 */
export const fetch = downloadRelease;

/**
 * Downloads the latest release from the given repository.
 * If `assetName` is undefined, it downloads the source zip files and extracts them.
 * Automatically extracts .zip files. This function does not download prereleases or drafts.
 * @param owner The owner of the repository.
 * @param repo The name of the repository.
 * @param tag The release tag to download.
 * @param assetName Optional asset to download. Defaults to the source files.
 * @returns A download result interface.
 */
export const fetchLatest = downloadLatestRelease;

/**
 * Sugar for:
 * ```
 * fetch(...).andThen(
 *     (result) => build(result.location),
 * )
 * ```
 * @param target Build a specific directory in the downloaded release.
 * @returns A promise that resolves with a Rostruct object and the download result.
 */
export const fetchAndBuild = async (target = "", ...args: Parameters<typeof fetch>) =>
	build((await downloadRelease(...args)).location + pathUtils.addTrailingSlash(target));

/**
 * Sugar for:
 * ```
 * fetchLatest(...).andThen(
 *     (result) => build(result.location),
 * )
 * ```
 * @param target Build a specific directory in the downloaded release.
 * @returns A promise that resolves with a Rostruct object and the download result.
 */
export const fetchLatestAndBuild = async (target = "", ...args: Parameters<typeof fetchLatest>) =>
	build((await downloadLatestRelease(...args)).location + pathUtils.addTrailingSlash(target));
