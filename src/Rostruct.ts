import { Session, VirtualScript } from "core";
import type { Executor } from "core";
import { clearReleaseCache, downloadLatestRelease, downloadRelease } from "utils/fetch-github-release";
import type { FetchInfo } from "utils/fetch-github-release";
import { pathUtils } from "utils/file-utils";
import Make from "modules/make/init";

/** Transforms files into Roblox objects and handles runtime. */
export class Rostruct {
	/** A list of folders created from the `build()` method. */
	public readonly tree = Make("Folder", { Name: "Tree" });

	/** The root directory of the project. */
	public readonly root: string;

	/** Information about the last call of `fetch` or `fetchLatest`. */
	public readonly fetchInfo?: FetchInfo;

	/** The Session for this project. */
	private readonly session: Session;

	/**
	 * Create a new Rostruct session.
	 * @param root A path to the project directory.
	 * @param fetchInfo Information about the downloaded GitHub release.
	 */
	constructor(root: string, fetchInfo?: FetchInfo) {
		assert(type(root) === "string", "(Rostruct) The path must be a string");
		assert(isfolder(root), `(Rostruct) The path '${root}' must be a valid directory`);
		this.root = pathUtils.formatPath(root);
		this.session = new Session(root);
		this.fetchInfo = fetchInfo;
	}

	/** Clears the fetched release cache. */
	public static clearCache = () => clearReleaseCache();

	/**
	 * Downloads and builds a release from the given repository.
	 * If `asset` is undefined, it downloads source files through the zipball URL.
	 * Automatically extracts .zip files.
	 *
	 * @param owner The owner of the repository.
	 * @param repo The name of the repository.
	 * @param tag The release tag to download.
	 * @param asset Optional asset to download. Defaults to the source files.
	 *
	 * @returns A promise that resolves with a Rostruct object, with a `fetchInfo` field.
	 */
	public static readonly fetch = async (...args: Parameters<typeof downloadRelease>): Promise<Rostruct> =>
		Rostruct.fromFetchInfo(await downloadRelease(...args));

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
	 * @returns A new Rostruct object, with the `fetchInfo` field set.
	 */
	public static readonly fetchAsync = (...args: Parameters<typeof downloadRelease>): Rostruct =>
		Rostruct.fromFetchInfo(downloadRelease(...args).expect());

	/**
	 * **This function does not download prereleases or drafts.**
	 *
	 * Downloads and builds the latest release release from the given repository.
	 * If `asset` is undefined, it downloads source files through the zipball URL.
	 * Automatically extracts .zip files.
	 *
	 * @param owner The owner of the repository.
	 * @param repo The name of the repository.
	 * @param asset Optional asset to download. Defaults to the source files.
	 *
	 * @returns A promise that resolves with a Rostruct object, with the `fetchInfo` field set.
	 */
	public static readonly fetchLatest = async (...args: Parameters<typeof downloadLatestRelease>): Promise<Rostruct> =>
		Rostruct.fromFetchInfo(await downloadLatestRelease(...args));

	/**
	 * **This function does not download prereleases or drafts.**
	 *
	 * Downloads and builds the latest release release from the given repository.
	 * If `asset` is undefined, it downloads source files through the zipball URL.
	 * Automatically extracts .zip files.
	 *
	 * @param owner The owner of the repository.
	 * @param repo The name of the repository.
	 * @param asset Optional asset to download. Defaults to the source files.
	 *
	 * @returns A Rostruct object, with the `fetchInfo` field set.
	 */
	public static readonly fetchLatestAsync = (...args: Parameters<typeof downloadLatestRelease>): Rostruct =>
		Rostruct.fromFetchInfo(downloadLatestRelease(...args).expect());

	/**
	 * Create a new Rostruct session from a downloaded GitHub release.
	 * @param root A path to the project directory.
	 * @param fetchInfo Information about the downloaded GitHub release.
	 */
	private static readonly fromFetchInfo = (fetchInfo: FetchInfo): Rostruct =>
		new Rostruct(fetchInfo.location, fetchInfo);

	/**
	 * Turns a folder in the root directory and all descendants into Roblox objects.
	 * If `dir` is not provided, this function transforms the root directory.
	 * @param fileOrFolder Optional specific folder to build in the root directory.
	 * @param props Optional properties to set after building the folder.
	 * @returns This Rostruct object.
	 */
	public build(fileOrFolder = "", props?: { [property: string]: unknown }): Instance {
		assert(
			isfile(this.root + fileOrFolder) || isfolder(this.root + fileOrFolder),
			`(Rostruct.build) The path '${this.root + fileOrFolder}' must be a file or folder`,
		);

		const instance = this.session.build(fileOrFolder);

		// Set object properties
		if (props !== undefined) {
			for (const [property, value] of pairs(props as unknown as Map<never, never>)) {
				instance[property] = value;
			}
		}

		instance.Parent = this.tree;

		return instance;
	}

	/**
	 * Simulate script runtime by running LocalScripts on deferred threads.
	 * @returns
	 * A promise that resolves with an array of scripts that finished executing.
	 * If one script throws an error, the entire promise will cancel.
	 */
	public start(): Promise<LocalScript[]> {
		return this.session.simulate();
	}

	/**
	 * Requires the given ModuleScript. If `module` is not provided, it requires
	 * the first Instance in `tree`.
	 * @param module The module to require.
	 * @returns A promise that resolves with what the module returned.
	 */
	public async require(module: ModuleScript): Promise<ReturnType<Executor>> {
		return this.requireAsync(module);
	}

	/**
	 * Requires the given ModuleScript. If `module` is not provided, it requires
	 * the first Instance in `tree`.
	 * @param module The module to require.
	 * @returns What the module returned.
	 */
	public requireAsync(module: ModuleScript): ReturnType<Executor> {
		assert(classIs(module, "ModuleScript"), `(Rostruct.requireAsync) '${module}' must be a module`);
		assert(module.IsDescendantOf(this.tree), `(Rostruct.requireAsync) '${module}' must be a in the Rostruct tree`);
		return VirtualScript.loadModule(module);
	}
}
