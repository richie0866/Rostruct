import { Store } from "./Store";
import { HttpService } from "modules/services";
import type { Executor, VirtualEnvironment } from "./types";

/** Class used to execute files in a Roblox instance context. */
export class VirtualScript {
	/** Maps VirtualScripts to their instances. */
	private static readonly fromInstance = Store.getStore<LuaSourceContainer, VirtualScript>("VirtualScriptStore");

	/** An identifier used for preventing cyclic references. */
	public readonly id = "VirtualScript-" + HttpService.GenerateGUID(false);

	/** The function to be called at runtime when the script runs or gets required. */
	private executor?: Executor;

	/** The executor's return value after being called the first time. ModuleScripts must have a non-nil result. */
	private result?: unknown;

	/** Whether the executor has already been called. */
	private jobComplete = false;

	constructor(
		/** The Instance that represents this object used for globals. */
		public readonly instance: LuaSourceContainer,

		/** The file this object extends. */
		public readonly path: string,

		/** The root directory of the Session. */
		public readonly rootDir: string,

		/** The contents of the file. */
		public readonly rawSource = readfile(path),

		/** A custom environment used during runtime. */
		private readonly scriptEnvironment: VirtualEnvironment = {
			script: instance,
			require: (obj: ModuleScript) =>
				// The function's levels are as such:
				// script (3) => require (2) => loadModule (1)
				VirtualScript.loadModule(obj, this, 3),
			_PATH: path,
			_ROOT: rootDir,
		},
	) {
		// Map the VirtualScript to the Roblox instance:
		VirtualScript.fromInstance.set(instance, this);
	}

	/**
	 * Gets the VirtualScript attached to a specific instance.
	 * @param obj The object that may have a VirtualScript.
	 * @returns A possible VirtualScript object.
	 */
	public static getFromInstance(obj: LuaSourceContainer): VirtualScript | undefined {
		return this.fromInstance.get(obj);
	}

	/**
	 * Requires a `ModuleScript`. If the module has a `VirtualScript` counterpart,
	 * this method will call `virtualScript.execute` and return the results.
	 *
	 * Detects recursive references using roblox-ts's RuntimeLib solution.
	 * The original source of this module can be found in the link below, as well as the license:
	 *
	 * Source: https://github.com/roblox-ts/roblox-ts/blob/master/lib/RuntimeLib.lua
	 * License: https://github.com/roblox-ts/roblox-ts/blob/master/LICENSE
	 *
	 * @param object The ModuleScript to require.
	 * @param caller The calling VirtualScript.
	 * @param level The position of an error when thrown. Defaults to `2` to position it at the function caller.
	 * @returns The required module.
	 */
	public static loadModule(object: ModuleScript, caller?: VirtualScript, level = 2): unknown {
		const module = this.fromInstance.get(object);

		if (!module) return require(object);

		// If there is a caller, map the module to the caller to check for
		// a recursive require call.
		if (caller) Loader.currentlyLoading.set(caller, module);

		// Check to see if this is a cyclic reference
		Loader.checkTraceback(module, level + 1);

		const result = module.runExecutor();

		// Thread-safe cleanup avoids overwriting other loading modules
		if (caller && Loader.currentlyLoading.get(caller) === module) Loader.currentlyLoading.delete(caller);

		return result;
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
	 * @returns The executor function.
	 */
	public createExecutor(): Executor {
		if (this.executor) return this.executor;
		const [f, err] = loadstring(this.getSource(), "=" + this.path);
		assert(f, err);
		return (this.executor = f);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns The value returned by the executor.
	 */
	public runExecutor(): ReturnType<Executor> {
		if (this.jobComplete) return this.result;

		const result = this.createExecutor()(this.scriptEnvironment);

		// Modules must return a value.
		if (this.instance.IsA("ModuleScript")) assert(result, `Module '${this.path}' did not return any value`);

		this.jobComplete = true;

		return (this.result = result);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns A promise which resolves with the value returned by the executor.
	 */
	public deferExecutor(): Promise<ReturnType<Executor>> {
		return Promise.defer((resolve) => resolve(this.runExecutor())).timeout(
			30,
			`Script ${this.path} reached execution timeout! Try not to yield the main thread in LocalScripts.`,
		);
	}

	/**
	 * Generates a source script that injects globals into the environment.
	 * @returns The source of the VirtualScript.
	 */
	private getSource(): string {
		return (
			"setfenv(1, setmetatable(..., { __index = getfenv(0), __metatable = 'This metatable is locked' }));" +
			this.rawSource
		);
	}
}

/** Handles loading modules and circular references. */
namespace Loader {
	/** Maps scripts to the module they're loading, like a history of `[Id of script who loaded]: Id of module` */
	export const currentlyLoading = new Map<VirtualScript, VirtualScript>();

	/**
	 * Gets the dependency chain of the VirtualScript.
	 * @param module The starting VirtualScript.
	 * @param depth The depth of the cyclic reference.
	 * @returns A string containing the paths of all VirtualScripts required until `currentModule`.
	 */
	export function getTraceback(module: VirtualScript, depth: number): string {
		let traceback = module.path;
		for (let i = 0; i < depth; i++) {
			// Because the references are cyclic, there will always be
			// a module loading in 'module'.
			module = currentlyLoading.get(module)!;
			traceback += `\n\t\t⇒ ${module.path}`;
		}
		return traceback;
	}

	/**
	 * Check to see if the module is part of a a circular reference.
	 * @param module The starting VirtualScript.
	 * @returns Whether the dependency chain is recursive, and the depth.
	 */
	export function checkTraceback(module: VirtualScript, level: number) {
		let currentModule: VirtualScript | undefined = module;
		let depth = 0;
		while (currentModule) {
			depth += 1;
			currentModule = currentlyLoading.get(currentModule);

			// If the loop reaches 'module' again, there is a circular reference.
			if (module === currentModule) {
				const message =
					`Requested module '${module.path}' was required recursively!\n\n` +
					`\tChain: ${getTraceback(module, depth)}`;
				error(message, level);
			}
		}
	}
}
