/*
 * File: VirtualScript.ts
 * File Created: Tuesday, 1st June 2021 8:58:51 pm
 * Author: richard
 * Description: Execute files as Roblox instances.
 */

import { globals } from "globals";
import Object from "packages/object-utils";
import { File } from "utils/filesystem";
import { HttpService } from "packages/services";
import { Executor, VirtualEnv } from "./types";

/** Class used to execute files in a Roblox instance context. */
export class VirtualScript {
	/** Maps VirtualScripts to their instances. */
	static readonly virtualScriptsByInstance = new Map<LuaSourceContainer, VirtualScript>();

	/** Keeps track of VirtualScripts created by scope. */
	static readonly virtualScriptsOfScope = new Map<number, VirtualScript[]>();

	/**
	 * Gets the VirtualScript attached to a specific instance.
	 * @param obj The object that may have a VirtualScript.
	 * @returns A possible VirtualScript object.
	 */
	static getFromInstance(obj: LuaSourceContainer): VirtualScript | undefined {
		return this.virtualScriptsByInstance.get(obj);
	}

	/**
	 * Gets a list of VirtualScripts for a specific scope.
	 * @param scope The scope to search for.
	 * @returns A list of VirtualScripts for the given scope.
	 */
	static getVirtualScriptsOfScope(scope: number): VirtualScript[] | undefined {
		return this.virtualScriptsOfScope.get(scope);
	}

	/**
	 * Requires a `ModuleScript`. If the module has a `VirtualScript` counterpart,
	 * this method will call `virtualScript.execute` and return the results.
	 * @param obj The ModuleScript to require.
	 * @returns The required module.
	 */
	private static require(obj: ModuleScript): VirtualScript | unknown {
		const virtualScript = this.virtualScriptsByInstance.get(obj);
		if (virtualScript) return virtualScript.runExecutor();
		else return require(obj);
	}

	/** An identifier used to store the object in `virtualScriptsByInstance`. */
	readonly id = `VirtualScript-${HttpService.GenerateGUID(false)}`;

	/** The function to be called at runtime when the script runs or gets required. */
	private executor?: Executor;

	/** The executor's return value after being called the first time. ModuleScripts must have a non-nil result. */
	private result?: unknown;

	/** Whether the executor has already been called. */
	private jobComplete = false;

	/** A custom environment for the object. */
	private readonly env: VirtualEnv;

	/** Creates a new VirtualScript object. */
	constructor(
		/** The Instance that represents this object used for globals. */
		readonly instance: LuaSourceContainer,

		/** The file this object extends. */
		readonly file: File,

		/** The scope of the Reconciler that created this object. Used to prevent overlapping globals when two Reconcilers are created. */
		readonly scope: number,
	) {
		assert(file.origin, `VirtualScript file must have an origin (${file.location})`);

		this.env = {
			script: instance,
			require: (obj: ModuleScript) => VirtualScript.require(obj),
			_PATH: file.location,
			_ROOT: file.origin,
		};

		// Initialize a scope array if it does not already exist.
		if (!VirtualScript.virtualScriptsOfScope.has(scope)) VirtualScript.virtualScriptsOfScope.set(scope, [this]);
		else VirtualScript.virtualScriptsOfScope.get(scope)!.push(this);

		// Tracks this VirtualScript for external use.
		VirtualScript.virtualScriptsByInstance.set(instance, this);
	}

	/**
	 * Generates a source script that injects globals into the environment.
	 * @returns The source of the VirtualScript.
	 */
	private getSource(): string {
		return "setfenv(1, setmetatable(..., { __index = getfenv(0) }));" + readfile(this.file.location);
	}

	/**
	 * Sets the executor function.
	 * @param exec The function to call on execution.
	 */
	setExecutor(exec: Executor) {
		assert(this.jobComplete === false, "Cannot set executor after script was executed");
		this.executor = exec;
	}

	/**
	 * Gets or creates a new executor function, and returns the executor function.
	 * @returns The executor function.
	 */
	createExecutor(): Executor {
		if (this.executor) return this.executor;
		const [f, err] = loadstring(this.getSource(), "=" + this.file.location);
		assert(f, err);
		return (this.executor = f);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns The value returned by the executor.
	 */
	runExecutor(): ReturnType<Executor> {
		if (this.jobComplete) return this.result;

		const result = this.createExecutor()(this.env);

		// Modules must return a value.
		if (this.instance.IsA("ModuleScript"))
			assert(result, `Module '${this.file.location}' did not return any value`);

		this.jobComplete = true;

		return (this.result = result);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns A promise which resolves with the value returned by the executor.
	 */
	deferExecutor(): Promise<ReturnType<Executor>> {
		return Promise.defer((resolve) => resolve(this.runExecutor())).timeout(
			30,
			`Script ${this.file.location} reached execution timeout! Try not to yield the main thread in LocalScripts.`,
		);
	}
}
