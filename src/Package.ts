import { Session, VirtualScript } from "core";
import type { Executor } from "core";
import type { FetchInfo } from "utils/fetch-github-release";
import { pathUtils } from "utils/file-utils";
import Make from "modules/make/init";

/** Transforms files into Roblox objects and handles runtime. */
export class Package {
	/** A Folder containing objects created from the `build()` method. */
	public readonly tree = Make("Folder", { Name: "Tree" });

	/** The root directory of the project. */
	public readonly root: string;

	/** Information about the last call of `fetch` or `fetchLatest`. */
	public readonly fetchInfo?: FetchInfo;

	/** The Session for this project. */
	private readonly session: Session;

	/**
	 * Create a new Rostruct Package.
	 * @param root A path to the project directory.
	 * @param fetchInfo Information about the downloaded GitHub release.
	 */
	constructor(root: string, fetchInfo?: FetchInfo) {
		assert(type(root) === "string", "(Package) The path must be a string");
		assert(isfolder(root), `(Package) The path '${root}' must be a valid directory`);
		this.root = pathUtils.formatPath(root);
		this.session = new Session(root);
		this.fetchInfo = fetchInfo;
	}

	/**
	 * Create a new Package from a downloaded GitHub release.
	 * @param root A path to the project directory.
	 * @param fetchInfo Information about the downloaded GitHub release.
	 */
	public static readonly fromFetch = (fetchInfo: FetchInfo): Package => new Package(fetchInfo.location, fetchInfo);

	/**
	 * Turns a folder in the root directory and all descendants into Roblox objects.
	 * If `dir` is not provided, this function transforms the root directory.
	 * @param fileOrFolder Optional specific folder to build in the root directory.
	 * @param props Optional properties to set after building the folder.
	 * @returns The Instance created.
	 */
	public build(fileOrFolder = "", props?: { [property: string]: unknown }): Instance {
		assert(
			isfile(this.root + fileOrFolder) || isfolder(this.root + fileOrFolder),
			`(Package.build) The path '${this.root + fileOrFolder}' must be a file or folder`,
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
		assert(classIs(module, "ModuleScript"), `(Package.require) '${module}' must be a module`);
		assert(module.IsDescendantOf(this.tree), `(Package.require) '${module}' must be a descendant of Package.tree`);
		return VirtualScript.loadModule(module);
	}

	/**
	 * Requires the given ModuleScript. If `module` is not provided, it requires
	 * the first Instance in `tree`.
	 * @param module The module to require.
	 * @returns What the module returned.
	 */
	public requireAsync(module: ModuleScript): ReturnType<Executor> {
		return this.require(module).expect();
	}
}
