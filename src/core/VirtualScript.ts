import { Store } from "./Store";
import { HttpService } from "modules/services";
import type { Executor, VirtualEnvironment } from "./types";

/** Maps scripts to the module they're loading, like a history of `[script who loaded]: module` */
const currentlyLoading = new Map<VirtualScript, VirtualScript>();

/**
 * Check if a module contains a cyclic dependency chain.
 * @param module The starting VirtualScript.
 */
function checkTraceback(module: VirtualScript) {
	let currentModule: VirtualScript | undefined = module;
	let depth = 0;
	while (currentModule) {
		depth += 1;
		currentModule = currentlyLoading.get(currentModule);

		// If the loop reaches 'module' again, this is a cyclic reference.
		if (module === currentModule) {
			let traceback = module.getChunkName();

			// Create a string to represent the dependency chain.
			for (let i = 0; i < depth; i++) {
				currentModule = currentlyLoading.get(currentModule)!;
				traceback += `\n\t\t⇒ ${currentModule.getChunkName()}`;
			}

			throw (
				`Requested module '${module.getChunkName()}' contains a cyclic reference` +
				`\n\tTraceback: ${traceback}`
			);
		}
	}
}

/** Manages file execution. */
export class VirtualScript {
	/** Maps VirtualScripts to their instances. */
	private static readonly fromInstance = Store.getStore<LuaSourceContainer, VirtualScript>("VirtualScriptStore");

	/** An identifier for this VirtualScript. */
	public readonly id = "VirtualScript-" + HttpService.GenerateGUID(false);

	/** The function to be called at runtime when the script runs or gets required. */
	private executor?: Executor;

	/** The executor's return value after being called the first time. ModuleScripts must have a non-nil result. */
	private result?: unknown;

	/** Whether the executor has already been called. */
	private jobComplete = false;

	/** A custom environment used during runtime. */
	private readonly scriptEnvironment: VirtualEnvironment;

	constructor(
		/** The Instance that represents this object used for globals. */
		public readonly instance: LuaSourceContainer,

		/** The file this object extends. */
		public readonly path: string,

		/** The root directory. */
		public readonly root: string,

		/** The contents of the file. */
		public readonly source = readfile(path),
	) {
		this.scriptEnvironment = setmetatable(
			{
				script: instance,
				require: (obj: ModuleScript) => VirtualScript.loadModule(obj, this),
				_PATH: path,
				_ROOT: root,
			},
			{
				__index: getfenv(0) as never,
				__metatable: "This metatable is locked",
			},
		);
		VirtualScript.fromInstance.set(instance, this);
	}

	/**
	 * Gets an existing VirtualScript for a specific instance.
	 * @param object
	 */
	public static getFromInstance(object: LuaSourceContainer): VirtualScript | undefined {
		return this.fromInstance.get(object);
	}

	/**
	 * Executes a `VirtualScript` from the given module and returns the result.
	 * @param object The ModuleScript to require.
	 * @returns What the module returned.
	 */
	public static requireFromInstance(object: ModuleScript): unknown {
		const module = this.getFromInstance(object);
		assert(module, `Failed to get VirtualScript for Instance '${object.GetFullName()}'`);
		return module.runExecutor();
	}

	/**
	 * Requires a `ModuleScript`. If the module has a `VirtualScript` counterpart,
	 * it calls `VirtualScript.execute` and returns the result.
	 *
	 * Detects recursive references using roblox-ts's RuntimeLib solution.
	 * The original source of this module can be found in the link below, as well as the license:
	 * - Source: https://github.com/roblox-ts/roblox-ts/blob/master/lib/RuntimeLib.lua
	 * - License: https://github.com/roblox-ts/roblox-ts/blob/master/LICENSE
	 *
	 * @param object The ModuleScript to require.
	 * @param caller The calling VirtualScript.
	 * @returns What the module returned.
	 */
	private static loadModule(object: ModuleScript, caller: VirtualScript): unknown {
		const module = this.fromInstance.get(object);
		if (!module) return require(object);

		currentlyLoading.set(caller, module);

		// Check for a cyclic dependency
		checkTraceback(module);

		const result = module.runExecutor();

		// Thread-safe cleanup avoids overwriting other loading modules
		if (currentlyLoading.get(caller) === module) currentlyLoading.delete(caller);

		return result;
	}

	/**
	 * Returns the chunk name for the module for traceback.
	 */
	public getChunkName() {
		const file = this.path.sub(this.root.size() + 1);
		return `@${file} (${this.instance.GetFullName()})`;
	}

	/**
	 * Sets the executor function.
	 * @param exec The function to call on execution.
	 */
	public setExecutor(exec: Executor) {
		assert(this.jobComplete === false, "Cannot set executor after script was executed");
		this.executor = exec;
	}

	/**
	 * Gets or creates a new executor function, and returns the executor function.
	 * The executor is automatically given a special global environment.
	 * @returns The executor function.
	 */
	public createExecutor(): Executor {
		if (this.executor) return this.executor;
		const [f, err] = loadstring(this.source, `=${this.getChunkName()}`);
		assert(f, err);
		return (this.executor = setfenv(f, this.scriptEnvironment));
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns The value returned by the executor.
	 */
	public runExecutor<T extends unknown = unknown>(): T {
		if (this.jobComplete) return this.result as never;

		const result = this.createExecutor()(this.scriptEnvironment);

		if (this.instance.IsA("ModuleScript") && result === undefined)
			throw `Module '${this.getChunkName()}' did not return any value`;

		this.jobComplete = true;

		return (this.result = result) as never;
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns A promise which resolves with the value returned by the executor.
	 */
	public deferExecutor<T extends unknown = unknown>(): Promise<T> {
		return Promise.defer<T>((resolve) => resolve(this.runExecutor<T>())).timeout(
			30,
			`Script ${this.getChunkName()} reached execution timeout! Try not to yield the main thread in LocalScripts.`,
		);
	}
}
