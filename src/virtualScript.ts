/*
 * File: virtualScript.ts
 * File Created: Tuesday, 1st June 2021 8:58:51 pm
 * Author: richard
 */

import { Promise } from "loader";
import { Files, File } from "utils/files";
import globals from "reserved";

const HttpService = game.GetService("HttpService");

/** Class used to connect a file to virtual code. */
class VirtualScript {
	/** Maps VirtualScripts to their instances. */
	private static readonly virtualScriptsByInstance = new Map<VirtualScript.Executable, VirtualScript>();

	/**
	 * Requires a `ModuleScript`. If the module has a `VirtualScript` counterparg, this function will call `virtualScript.execute` and return the results.
	 * @param obj The ModuleScript to require.
	 * @returns The required module.
	 */
	public static loadModule(obj: ModuleScript): VirtualScript | unknown {
		const virtualScript = VirtualScript.virtualScriptsByInstance.get(obj);
		if (virtualScript) return virtualScript.execute();
		else return require(obj);
	}

	/**
	 * Returns the `VirtualScript` instance that was created for the given `Instance`.
	 * @param obj The Instance to search by.
	 * @returns The corresponding VirtualScript.
	 */
	public static fromInstance(obj: VirtualScript.Executable): VirtualScript | undefined {
		return this.virtualScriptsByInstance.get(obj);
	}

	/** An identifier for this object. */
	public readonly id: string;

	/** The Instance this object was created for. */
	public readonly instance: VirtualScript.Executable;

	/** The FileDescriptor this object represents. */
	public readonly file: File<Files.FileType.File>;

	/** The scope of the Reconciler that created this object. Used to prevent overlapping globals when two Reconcilers are created. */
	private readonly scope: number;

	/** The function to be called at runtime when the script runs or gets required. */
	private executor?: VirtualScript.Executor;

	/** The executor's return value after being called the first time. ModuleScripts must have a non-nil result. */
	private result?: unknown;

	/** Whether the executor has already been called. */
	private isLoaded = false;

	/** The custom environment of the object. */
	private readonly env: VirtualScript.Environment;

	/** Construct a new VirtualScript. */
	constructor(obj: VirtualScript.Executable, file: File<Files.FileType.File>, scope: number) {
		assert(file.origin, `VirtualScript file must have an origin (${file.location})`);

		this.id = `VirtualScript-${HttpService.GenerateGUID(false)}`;
		this.instance = obj;
		this.file = file;
		this.scope = scope;

		this.env = new Map<VirtualScript.EnvironmentKey, unknown>([
			["script", obj],
			["require", (obj: ModuleScript) => VirtualScript.loadModule(obj)],
			["_PATH", file.location],
			["_ROOT", file.origin],
		]);

		globals.environments.set(`${scope}-${this.id}`, this.env);
		VirtualScript.virtualScriptsByInstance.set(obj, this);
	}

	/**
	 * Generates a source script with globals defined as local variables.
	 * @returns The source of the VirtualScript.
	 */
	private getSource(): string {
		let header = `local _ENV = getgenv()._ROSTRUCT.environments['${this.scope}-${this.id}']; `;
		for (const [key] of this.env) {
			header += `local ${key} = _ENV['${key}']; `;
		}
		return header + readfile(this.file.location);
	}

	/**
	 * Sets the executor function.
	 * @param exec The function to call on execution.
	 */
	public setExecutor(exec: VirtualScript.Executor) {
		this.executor = exec;
		this.result = undefined;
	}

	/**
	 * Gets or creates a new executor function
	 * @returns The function to call on execution.
	 */
	public createExecutor(): VirtualScript.Executor {
		if (this.executor) return this.executor;
		const [f, err] = loadstring(this.getSource(), "=" + this.file.location);
		assert(f, err);
		return (this.executor = f);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns The value returned by the executor.
	 */
	public execute(): ReturnType<VirtualScript.Executor> {
		if (this.isLoaded) return this.result;

		const result = this.createExecutor()();

		// Modules must return a value.
		if (this.instance.IsA("ModuleScript"))
			assert(result, `Module '${this.file.location}' did not return any value`);

		this.isLoaded = true;

		return (this.result = result);
	}

	/**
	 * Runs the executor function if not already run and returns results.
	 * @returns A promise which resolves with the value returned by the executor.
	 */
	public executePromise(): Promise<ReturnType<VirtualScript.Executor>> {
		return Promise.defer((resolve) => resolve(this.execute())).timeout(
			30,
			`Script ${this.file.location} reached execution timeout! Try not to yield the main thread in LocalScripts.`,
		);
	}
}

declare namespace VirtualScript {
	/** A script that can be created by Rostruct. */
	export type Executable = ModuleScript | LocalScript | Script;
	export type Executor = () => unknown;
	export type EnvironmentKey = "script" | "require" | "_PATH" | "_ROOT";

	/** Base environment for VirtualScript instances. */
	export type Environment = Map<EnvironmentKey, unknown>;
}

export = VirtualScript;
